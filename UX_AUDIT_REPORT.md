# Recruit — UI/UX Audit Report
**Reviewer perspective:** Senior product designer, enterprise SaaS
**Audit date:** April 30, 2026
**Scope:** Full app — auth, shell, dashboard, candidates, jobs, matches, pipeline, tasks, calendar, reports, assistant, settings, pricing
**Status:** Read-only review. No code changed. Report-first.

---

## 1. Direct Answer (The Bottom Line)

**The bones are good. The skin is loud, inconsistent, and half-finished.**

You have the right information architecture, the right screens, and the right enterprise-SaaS instinct. What's holding the product back is **not** the structure — it's three things, in this order:

1. **A design-system layer that isn't actually a system.** Hardcoded hex values, inline `<style>` blocks, conflicting radii and shadows, and a brand color that doesn't match your own spec. Every screen feels like it was built in isolation.
2. **A massively over-fragmented Candidate Detail page** (40+ components, 8 deep tabs, multiple competing "insight cards"). This is your most-used screen and currently your most chaotic.
3. **A lot of stub pages** (Tasks, Calendar, Reports, Settings, Matches, Assistant, Pricing) that look like they exist in the sidebar but aren't really there yet. This is the single biggest reason the product feels "not great" — the sidebar promises 10 destinations and only 4 are real.

If you fix only those three things, the perceived quality of the product jumps dramatically — without changing the IA, copy, or feature set.

---

## 2. Step-by-Step Reasoning (How I Got Here)

### 2.1 What I evaluated
I read your design spec (CLAUDE.md / AGENTS.md), the global CSS tokens, and the source for every major screen plus the core design-system components (Badge, ScoreRing, Modal, MultiSelect, AppShell, AuthStoryPanel). I compared **what your spec says you want** to **what's actually in the code**.

### 2.2 What's working well (don't touch)
- **Information architecture** — sidebar items, screen list, and pipeline stages are correct for recruiter workflow.
- **App shell** — floating sidebar with rounded surface, sticky topbar, mobile drawer pattern. Solid.
- **Auth flow** — split-screen login/signup with story panel + form is a clean enterprise pattern.
- **Candidate list filtering** — 7 filter dimensions with active-state chips and a pop-out panel. Good UX scaffolding.
- **Dark-mode plumbing** — CSS variables, density scaling, accent-RGB tokens are conceptually right.
- **Motion primitives** — `fx-hover-lift`, `fx-stagger`, `task-enter`, `surface-lift` are all on-brand.

### 2.3 What's actually broken — by category

#### A. Design System (the big one)
| # | Issue | Where it shows up | Severity |
|---|-------|-------------------|----------|
| A1 | **Brand color ≠ spec.** Spec calls for purple (`#5B3DF5`), code uses royal blue (`#2E47E0`). The whole product reads "fintech / data tool", not "premium recruiter SaaS". | Every primary button, badge, ring, focus state | 🔴 High |
| A2 | **Inline `<style>` chaos.** The dashboard alone has ~300 lines of inline CSS for the hero. This bypasses your tokens entirely. | `dashboard/page.tsx`, several detail cards | 🔴 High |
| A3 | **Hardcoded hex literals everywhere.** `#20319C`, `#273DC0`, `#525252`, `#F5F5F5` repeated across 30+ files instead of `var(--color-*)`. | Nearly all candidate-detail cards, Badge, ScoreRing | 🔴 High |
| A4 | **Inconsistent border radii.** Spec says cards = 18px, panels = 20px. Reality: cards use 14px, 18px, 20px, and 22px depending on file. Buttons mix 8px / 10px / 12px. | Dashboard hero (22px), candidate cards (14px), buttons (varies) | 🟠 Med |
| A5 | **Shadow definitions duplicated.** Sometimes `var(--shadow-card)`, sometimes inline rgba, sometimes no shadow at all on cards that should lift. | Cards across all screens | 🟠 Med |
| A6 | **Semantic colors collapsed into one hue.** Your `globals.css` defines `--color-success`, `--color-warning`, `--color-error` but maps all of them to brand-blue. So "Placed", "Interview", "Rejected" all read as the same color. | Status chips on candidate cards & pipeline | 🔴 High |
| A7 | **Dark-mode override hacks.** `globals.css` has ~400 lines of `[style*="..."]` selector overrides because inline styles bypass tokens. Symptom of A2/A3. | Whole codebase | 🟠 Med |
| A8 | **Typography scale not enforced.** Sizes appear at 11.5 / 12 / 13 / 14 / 15 / 16 / 26 / 30 / 34 with no clear rhythm. Spec defines a clean 12-tier scale that isn't being used. | Almost every screen | 🟠 Med |
| A9 | **Spacing system half-honored.** 8-px grid is followed in Tailwind utilities but broken every time someone writes `p-[5px]`, `gap-[11px]`, `mt-[14px]`. | Detail cards, dashboard widgets | 🟡 Low |
| A10 | **No central tokens file.** Tokens live in `globals.css` but components don't always reference them. There's no `tokens.ts` or single source of truth. | Project-wide | 🟠 Med |

#### B. Candidate Detail (single highest-leverage screen)
- **40+ components** for one page (e.g., `TopSkillsFromExperienceCard`, `TopSkillsByMatchCard`, `TopSkillsInProjectsCard`, `SkillsCategoriesCard`, `SkillsOverviewCard`, `OtherSkillsCard`, `CoreSkillsCard` — **seven different "skills" cards**). Recruiters can't possibly use all of these.
- **8-deep tab navigation** (Overview, Resumes, Experience, Skills, Projects, Notes, Applications, Activity). On a 1440px screen, the tab row scrolls. Recruiters work fast — this is too many.
- **Nested cards inside nested cards** in the Overview tab. Card-on-card visually flattens hierarchy and adds noise.
- **No "next best action" header.** A recruiter opening a candidate should see: who they are, where they are in pipeline, what to do next. Right now the header is just identity + edit.
- **ScoreRing always renders the same blue** regardless of score (80+, 60+, <60 all use `#273DC0`). The ring has no informational value — it's decoration.
- **Right utility panel is sticky**, but on common laptop widths it competes with main content.

#### C. Dashboard
- **Hero is over-designed** — animated wave emoji, rising stat pills, gradient strip. It costs vertical space without surfacing actionable info.
- **Stat pills aren't clickable** — they're presentational only. Every stat in an action-first dashboard should be a deep link ("12 interviews scheduled" → click → calendar filtered to interviews).
- **Right rail (AI assistant + schedule + tasks) hidden on mobile.** AI assistant is described in the spec as the recruiter's primary action surface — losing it on mobile is a flow break.
- **"Pipeline healthy" badge is a hardcoded string.** No actual signal logic behind it.
- **No empty state** for "new account, zero candidates" — the dashboard would be a sea of zeros with no guidance to "Add your first candidate".

#### D. Stub Pages (the credibility problem)
The sidebar advertises **10 destinations**. Of those:
- **Working with real layout:** Dashboard, Candidates, Candidate Detail, Jobs (list + detail), Auth pages — ~6 screens
- **Stubs / unfinished placeholders:** Matches, Pipeline, Tasks, Calendar, Reports, Assistant, Settings, Pricing — **8 screens**

When 8 of 10 nav items go to half-built pages, the product can't be demoed end-to-end. This is the **fastest** thing to fix for perceived quality.

#### E. Cross-cutting UX gaps
| # | Gap | Why it matters |
|---|-----|----------------|
| E1 | No global search (`⌘K` / "search everything") | Recruiter cognitive load — they have to remember which section a candidate/job lives in |
| E2 | Bulk action buttons ("Assign", "Archive") have no handlers | Looks broken on click |
| E3 | No confirmation dialogs on destructive actions | Risky for archive / delete / bulk reassign |
| E4 | No empty states on most pages | New users see a blank screen with no next step |
| E5 | No loading states / skeletons except on /matches | "Did my click do anything?" |
| E6 | No toast / notification system for success feedback | "Did my save work?" |
| E7 | Keyboard focus rings inconsistent | Accessibility + power-user pain |
| E8 | Mobile responsiveness rough on Candidate Detail and Dashboard | Hero pills wrap, right rail vanishes |
| E9 | Right utility panel only exists on Dashboard + Candidate Detail; absent on Tasks, Calendar, Reports, Settings, Pipeline | Spec says it should be a consistent rhythm |
| E10 | No onboarding / first-run experience after signup | New users land on an empty dashboard with no tour |

---

## 3. Alternative Perspectives (Other Ways to See This)

### 3.1 The "ship the demo" lens
If your near-term goal is **a sales / investor demo**, the priority order changes:
- Forget the design-system refactor. Just hide the broken nav items and ship the 4 working screens with polish.
- This buys you 2 weeks but creates technical debt that'll cost a month later.

### 3.2 The "scale the team" lens
If you're about to onboard more engineers/designers, **the design-system fix is non-negotiable first.** Otherwise every new hire writes more inline styles, more `#273DC0` literals, more competing skill cards. The mess compounds.

### 3.3 The "win on AI" lens
If your differentiator is the AI Assistant + JD Matching, then **the Assistant page being a stub is the existential issue**, not the color palette. Every minute on color is a minute not on the actual moat.

### 3.4 The "user research first" lens
Honest counter-argument: I'm reviewing visual + structural quality. I haven't watched a real recruiter use this. Some of my "reduce this" instincts (8 tabs, 40 cards) might be wrong if recruiters actually use all of them. Worth 3 user interviews before refactoring Candidate Detail.

### 3.5 Risks and trade-offs to make explicit
- **Color migration is contagious.** Changing the brand from blue to purple touches ~50 files. Don't do it piecemeal — do it in one sitting via tokens, or don't do it.
- **Reducing tabs is opinionated.** If your power users have built muscle memory around 8 tabs, collapsing them to 4 will frustrate them. Ship as an A/B or behind a setting.
- **"Action-first dashboard" can become noisy.** If every stat is clickable, the page becomes a wall of links. Reserve actionable color for the top 3 stats only.

---

## 4. Practical Action Plan (What I'd Do, In Order)

This is the order I'd execute if you asked me to start tomorrow. Each item is sized in days, not weeks.

### Phase 0 — Decisions you need to make (1 hour, you and me on a call)
1. **Brand color: stay blue, or move to spec purple?** Decide once, lock it.
2. **Stub pages: hide them from sidebar, or build them?** If hide, which ones?
3. **Candidate Detail: collapse 8 tabs to 4–5, or keep 8 and just tidy?**
4. **Mobile-first or desktop-only for v1?** Currently it's desktop with mobile bolted on.

### Phase 1 — Design System foundation (2–3 days)
1. Create `src/styles/tokens.css` (or extend `globals.css`) with the **complete** semantic color map: brand, neutral, success, warning, error, info — each with bg / fg / border variants.
2. Replace all `[style="background:#XXXXXX"]` inline literals with `style={{ background: "var(--color-...)"}}` or Tailwind utility classes.
3. Delete the 400 lines of dark-mode override hacks in `globals.css` once #2 is done — they exist only to compensate for #2.
4. Standardize border radii: card = 18px, panel = 22px, input = 12px, button = 12px, pill = 999px. Enforce via CSS variables only.
5. Standardize shadow scale: `--shadow-card`, `--shadow-card-hover`, `--shadow-panel`, `--shadow-dropdown`, `--shadow-modal`. Delete inline rgba shadows.
6. Refactor `Badge.tsx` to use 6 semantic tones (brand, neutral, success, warning, error, info) — each derives from tokens, no hardcoded hex.
7. Refactor `ScoreRing.tsx` to color-code by threshold (red < 50, amber 50–75, green 75+) — currently always blue.

### Phase 2 — Stub pages (3–5 days)
8. **Hide** Reports, Pricing, and Settings from the sidebar until they're real. Ship a "Coming soon" empty state on each.
9. **Build** Tasks (kanban or list with the existing TasksWidget pattern), Calendar (month/week/day with placeholder events), Pipeline (drag-and-drop board using existing animations). These are core to recruiter workflow.
10. **Build** AI Assistant page — full chat surface with prompt chips and example queries. This is the differentiator; it can't stay a stub.
11. **Build** Matches results page — ranked candidate cards with match-reason chips and "Shortlist" CTA.

### Phase 3 — Candidate Detail simplification (2 days)
12. Audit the 40+ candidate-detail components. Merge the 7 "skills" cards into **one** `SkillsCard` with optional sub-sections (core / by experience / by project).
13. Collapse 8 tabs to 5: **Overview, Resumes, Activity, Applications, Notes**. Move Experience/Skills/Projects/Education into Overview as collapsible sections.
14. Add a **"Next best action"** strip at the top of the page (e.g., "Send to Acme — Senior Backend role", "Schedule interview", "Refresh resume").
15. Eliminate nested cards in Overview — flatten to a single card per section with proper spacing.

### Phase 4 — UX gaps (2 days)
16. Add `⌘K` global search (candidates + jobs + tasks).
17. Add empty states for every page (illustration + headline + primary CTA).
18. Add skeleton loaders for async surfaces (matches, candidate list, job list, dashboard widgets).
19. Add a toast notification system for success / error feedback.
20. Add confirmation dialogs for archive / delete / bulk reassign.

### Phase 5 — Polish (1 day)
21. Audit mobile breakpoints on Candidate Detail and Dashboard.
22. Add visible focus rings on all interactive elements.
23. Run an accessibility pass (contrast, ARIA labels, keyboard navigation).

**Total estimate: ~10–14 working days** for a single designer-developer pairing to take the app from "good bones, rough skin" to "ship to a paying customer".

---

## 5. What I Need From You (Before I Touch Code)

Reply to me with **one of three answers** for each item below:
- ✅ "Do it" — I'll execute exactly as proposed.
- 🔄 "Modify" — tell me what to change.
- ⛔ "Skip" — I won't touch it.

| # | Item | Your call |
|---|------|-----------|
| 1 | Migrate brand color from blue (`#2E47E0`) to spec purple (`#5B3DF5`) | |
| 2 | Hide Reports / Pricing / Settings from sidebar until built | |
| 3 | Build Tasks, Calendar, Pipeline, AI Assistant, Matches as real pages | |
| 4 | Collapse Candidate Detail from 8 tabs to 5 | |
| 5 | Merge 7 "skills" cards into one | |
| 6 | Add `⌘K` global search | |
| 7 | Add empty states + skeleton loaders + toast system | |
| 8 | Replace all inline `style={{}}` with token-backed classes | |
| 9 | Restore semantic colors (success=green, warning=amber, error=red) instead of all-blue | |
| 10 | Add "Next best action" strip on Candidate Detail | |

Once you answer, I'll start with whichever item you mark highest priority. I won't move until you've reviewed.

---

*End of report.*
