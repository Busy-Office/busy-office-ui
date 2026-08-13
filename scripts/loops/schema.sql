-- loops.db schema. This DB is a DERIVED MIRROR, never the source of truth:
-- iterations come from .roundtable/loop-log.md and metrics from
-- .roundtable/loop-metrics.jsonl. Rebuild any time with rebuild_from_log.py.

CREATE TABLE IF NOT EXISTS iterations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         TEXT NOT NULL,          -- "YYYY-MM-DD HH:MM"
  loop       TEXT NOT NULL,          -- Continue | Standardize | Optimize | Explore | Roadmap | Objective | Meta
  mode       TEXT,                   -- router mode this iteration ran (bug | build | tidy | explore | grill | plan | meta)
  item       TEXT,                   -- what was worked on
  outcome    TEXT,                   -- shipped | fixed | discarded | committed | ...
  commit_sha TEXT                    -- short sha, or NULL
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
