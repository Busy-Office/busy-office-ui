# Research: modern enterprise app-frame design (for 123.2 / 119.3 + 30.0)

Commissioned 2026-08-23 after the owner clarified 119.3: NOT an iframe —
"what is modern design — how to design the app framework?" — and answered
30.0: a new ERP overview/dashboard pattern with a module sidebar. One
research agent; local files read: base/primitives, patterns/role-home,
patterns/app-launch, concepts/layouts. URLs at the end.

## (a) Modern consensus anatomy of an enterprise app frame

Every current design system studied converges on the same three-layer
skeleton, split by a strict **frame vs. page** ownership line:

**1. A persistent top bar** — full-width, topmost, "true everywhere" only:
- App/workspace switcher: Salesforce's "waffle" grid, Microsoft 365's app
  launcher, ServiceNow Polaris's "Contextual App Pill".
- Global search: SAP Fiori's shell-bar search, ServiceNow's omnipresent
  search, Atlassian's top-bar search.
- Notifications, user/account menu, and one primary action (Atlassian
  keeps "search and create" as its only universal top-bar actions after
  its 2023 nav redesign).
- **Never navigation for the current module** — that job moved out of the
  top bar in Atlassian's redesign specifically so the bar could be
  "streamlined across all products."

**2. A persistent side nav** — the module's own navigation, contextual to
whatever app/module is active:
- IBM Carbon: use a left panel once there are >5 secondary items or users
  switch often; below ~1056px it replaces header nav.
- GitLab Pajamas: sidebar header constant, body changes per context;
  collapsible, pinned items, hover-reveal overlay when collapsed.
- Microsoft Dynamics 365's SiteMap is the cleanest literal example of
  "switcher + sidebar in one component": Areas sit as a picker at the
  BOTTOM of the nav bar (module switch), and the selected Area's Subareas
  populate the sidebar list above it (module nav) — both filtered by the
  user's security role.

**3. Main content, entirely page-owned** — including breadcrumbs/page
title. GOV.UK made this boundary explicit in Aug 2024 with its separate
"Service navigation" component, specifically to keep suite-wide tools and
service-level tools from blurring.

**Responsive:** three-tier degrade — full sidebar (desktop) → icon-only
rail (tablet) → bottom tab bar or off-canvas drawer (mobile).

## (b) Suite-overview + module-sidebar combos in real products

- **SAP Fiori Spaces/Pages + "My Home"**: a Space (role-scoped) holds
  Pages of tiled apps; "My Home" is a special personalizable Page serving
  as the cross-module overview — same shell bar, same tile mechanism as
  every other page, role-aggregated content.
- **Dynamics 365 SiteMap**: Areas (bottom picker = module switch) +
  Subareas (sidebar = module nav) is ONE navigation object; a "Dashboard"
  subarea inside any Area is how a cross-module overview is inserted
  without inventing new chrome.
- **Atlassian**: one shared top bar persists across Jira/Confluence/etc.;
  switching product swaps the *entire* sidebar — frame is suite-level,
  sidebar is strictly module-level, never mixed.

## (c) Gap analysis vs what busy-office-ui already ships

**Ships and matches the consensus well:**
- `.bo-app-shell` is structurally the same skeleton — `bo-navbar` header
  + `bo-sidebar-nav` + `main`, named container, sidebar collapses to
  icon-only under 900px shell width with labels kept in the a11y tree.
- `role-home` is a real analog to Fiori's "My Home".
- `app-launch` is a real analog to Fiori's tile Pages / M365 waffle.
- `concepts/layouts` already does the "when is X wrong" framing.

**Genuinely missing:**
1. **No documented app-frame anatomy for the header itself.** The shell
   markup elides the header's contents — no named place for a module
   switcher, search, notifications, or user menu, and no frame-owned vs
   page-owned guidance (exactly the owner's question).
2. **No pattern showing a suite-level overview AND a live module sidebar
   at once** — no equivalent of Dynamics' Areas-picker-plus-Subareas or
   Fiori's Space/Page structure for switching between modules from
   inside one. (= the 30.0 ask.)
3. **No module-switcher affordance distinct from the user menu** — the
   only implied way back to app-launch is unstated.
4. **No mobile tier beyond icon-only collapse** — no bottom-nav or
   off-canvas tier documented, unlike the rail→bottom-nav consensus.
5. Breadcrumb placement/ownership not addressed in the shell docs.

## (d) What a CSS-first framework should / should not own

**Should own:** shell structural CSS + collapse mechanics (already does);
a documented named slot/class for a module-switcher trigger and its menu
shape; the icon-rail/bottom-nav responsive tiers as container-query
breakpoints; two-channel active-state styling for nav items; the
tile/grid visuals for a suite overview (`bo-widget-grid` already exists
and is reusable per app-launch's own note).

**Should NOT own:** which modules exist, their order, or role/permission
visibility (server concern); real hrefs/routing; the data behind switcher
badges (same async-fragment/silent-degrade contract app-launch already
specifies); deployment IA decisions.

## Sources

- https://help.sap.com/doc/34796706f38646f68d51a0fa0d4636e4/100/en-US/0f3930af131d4009a71b28ecad6763c3.html
- https://www.sap.com/design-system/fiori-design-web/v1-96/foundations/integration-and-services/sap-fiori-launchpad/sap-fiori-launchpad-my-home
- https://learn.microsoft.com/en-us/dynamics365/customerengagement/on-premises/customize/create-site-map-app?view=op-9-1
- https://help.salesforce.com/s/articleView?id=xcloud.basics_app_launcher_lex.htm
- https://horizon.servicenow.com/guidelines/unified-navigation
- https://carbondesignsystem.com/components/UI-shell-header/usage/
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://fluent2.microsoft.design/components/web/react/core/nav/usage
- https://atlassian.design/components/navigation-system
- https://www.atlassian.com/blog/design/designing-atlassians-new-navigation
- https://design.gitlab.com/patterns/navigation-sidebar/
- https://design-system.service.gov.uk/patterns/navigate-a-service
