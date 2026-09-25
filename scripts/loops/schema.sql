-- loops.db schema. This DB is a DERIVED MIRROR, never the source of truth:
-- iterations come from .roundtable/loop-log.md and metrics from
-- .roundtable/loop-metrics.jsonl. Rebuild any time with rebuild_from_log.py.

CREATE TABLE IF NOT EXISTS iterations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         TEXT NOT NULL,          -- "YYYY-MM-DD HH:MM"
  loop       TEXT NOT NULL,          -- record_iteration.py's LOOPS set (393.5)
  mode       TEXT,                   -- router mode this iteration ran (bug | build | tidy | explore | grill | plan | meta)
  item       TEXT,                   -- what was worked on
  outcome    TEXT,                   -- shipped | fixed | discarded | committed | ...
  commit_sha TEXT,                   -- short sha, or NULL
  milestone  TEXT,                   -- `milestone=Mn` tag of the row, or NULL (393.5)
  track      TEXT,                   -- `track=defect` tag of the row, or NULL (393.5)
  route      TEXT,                   -- `route=` — the routes.json route the item ran (393.6)
  model      TEXT,                   -- `model=` — the model actually used (393.6)
  agent      TEXT,                   -- `agent=` — the agent type that did the work (393.6)
  skill      TEXT,                   -- `skill=` — the skill it leaned on (393.6)
  first_try  TEXT,                   -- `first-try=` landed | reworked | reverted (393.6)
  tier       TEXT,                   -- `tier=` — the tier actually run; top when a none tier was substituted (393.6)
  trigger    TEXT                    -- `trigger=` D1 | D2 | D3 | D4 | sharpen — why rule D ran the planner (393.7)
);

CREATE TABLE IF NOT EXISTS metrics (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  ts    TEXT  NOT NULL,              -- "YYYY-MM-DD HH:MM"
  name  TEXT  NOT NULL,              -- bundle-gz-kb | selector-count | gate-pass | ...
  value REAL  NOT NULL,
  unit  TEXT                         -- kB | count | ratio | ...
);

CREATE INDEX IF NOT EXISTS idx_iter_loop   ON iterations(loop);
CREATE INDEX IF NOT EXISTS idx_iter_item   ON iterations(item);
CREATE INDEX IF NOT EXISTS idx_metric_name ON metrics(name);

-- Roadmap backlog, mirrored from ROADMAP.md by generate_status.py.
-- DERIVED: rebuilt wholesale on every run, never written by hand, git-ignored
-- with the rest of loops.db. The markdown stays the record -- this exists so
-- "the oldest still-open item" is an ORDER BY instead of a scan of a file that
-- reached 9,824 lines (storage doctrine, CLAUDE.md, widened 2026-08-25).
CREATE TABLE IF NOT EXISTS roadmap_items (
  item_id  TEXT PRIMARY KEY,         -- "145.1", or the title for named items
  slice    TEXT,                     -- "145", or NULL when the item is named
  title    TEXT NOT NULL,
  blocked  INTEGER NOT NULL DEFAULT 0,  -- owner-blocked: BLOCKED ON / OWNER CALL / OWNER OR X CALL / OWNER · / NEEDS-RUNTIME / Route: owner
  -- The own-line markers (roadmap 393.3). A table whose columns differ from
  -- these is dropped and rebuilt by generate_status.py; it is derived.
  after        TEXT NOT NULL DEFAULT '',   -- every `After:` target, ", "-joined (reconciled against the source)
  after_open   TEXT NOT NULL DEFAULT '',   -- `After:` targets still open, ", "-joined; non-empty = dependency-blocked
  parked       TEXT NOT NULL DEFAULT '',   -- `Parked:` milestone id
  parked_held  INTEGER NOT NULL DEFAULT 0, -- 1 while that milestone is ACTIVE
  browser      INTEGER NOT NULL DEFAULT 0, -- NEEDS-BROWSER
  milestone    TEXT NOT NULL DEFAULT '',
  phase        TEXT NOT NULL DEFAULT '',
  route        TEXT NOT NULL DEFAULT '',
  track        TEXT NOT NULL DEFAULT '',
  synced   TEXT NOT NULL             -- "YYYY-MM-DD HH:MM" of the rebuild
);
CREATE INDEX IF NOT EXISTS roadmap_items_slice ON roadmap_items(slice);
