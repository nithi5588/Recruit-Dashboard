@AGENTS.md
# Recruitment Management Dashboard — Design & AI Build Instructions

## Document Purpose
This document is the **single source of truth** for designing, validating, and building the Recruitment Management Dashboard MVP.

It is written so an AI design agent, product agent, or development agent can follow the structure consistently without guessing.

The objective is to design a **clean, recruiter-first recruitment operations platform** where teams can:
- keep all candidates in one place,
- manage multiple resumes per candidate,
- match candidates against job descriptions,
- track submissions and interview progress,
- manage tasks and calendars,
- and operate from one unified dashboard.

---

# 1. Product Overview

## 1.1 Product Name
Working name: **Recruit**

## 1.2 Product Goal
Build a recruitment management dashboard that allows recruiters and recruitment operations teams to manage **50–100+ candidates in one system**, maintain structured candidate data, prepare multiple role-specific resumes, parse job descriptions, match candidates to jobs, and track progress across the entire recruiting pipeline.

## 1.3 Core Business Context
The business maintains a pool of registered IT candidates and markets them to US clients.  
The team gets paid when candidates are placed.

The main operational challenge is that candidate information, job matching, resumes, and follow-ups are difficult to manage when spread across spreadsheets, chats, and separate systems.

The platform must solve this by centralizing:
- candidate information,
- resume versions,
- job matching,
- recruiter workflows,
- tasks,
- interviews,
- and reporting.

---

# 2. Validation Requirements

## 2.1 Primary Validation Goal
Validate whether recruiters can manage all candidates in one place and quickly move candidates from intake to match to submission to interview.

## 2.2 Problems to Solve
1. Candidate information is fragmented.
2. Recruiters cannot easily understand who fits which role.
3. Multiple resume versions are not organized.
4. High-priority candidates are hard to surface.
5. JD matching is slow and manual.
6. Follow-ups, interviews, and submissions are not tracked clearly.
7. Teams need a more intelligent, workflow-based system instead of spreadsheets.

## 2.3 MVP Validation Scope
The MVP must validate these capabilities:
- centralized candidate database,
- candidate detail management,
- multi-resume support,
- JD input and parsing,
- AI-based candidate matching,
- recruiter chatbot assistant,
- task management,
- calendar/interview management,
- pipeline tracking,
- dashboard visibility.

---

# 3. Product Users

## 3.1 Primary Users
- Recruiters
- Candidate marketing teams
- Recruitment operations managers
- Account managers
- Team leads

## 3.2 User Mindset
This product is not built for casual browsing.  
It is built for people who need to take action quickly.

The interface should help users answer:
- Who should I contact today?
- Which candidates fit this job?
- Which resume should I use?
- Which candidates are high priority?
- Who is in interview, submitted, or available now?
- What needs to happen next?

---

# 4. Product Principles

## 4.1 Design Principles
1. **Action-first, not chart-first**
2. **Clear and calm UI**
3. **Minimal clutter**
4. **Fast candidate lookup**
5. **Strong visual hierarchy**
6. **Reusable components**
7. **Recruiter productivity over decoration**
8. **Soft premium modern SaaS style**
9. **Keep forms simple**
10. **Complexity should appear only when needed**

## 4.2 UX Principles
1. Reduce recruiter effort
2. Keep critical actions visible
3. Minimize form friction
4. Surface next best actions
5. Use consistent patterns everywhere
6. Make scanning easy
7. Prefer drawer/panel interactions before deep navigation where possible
8. Show meaningful status and progress
9. Use AI as assistant, not as noisy decoration
10. Preserve a clean and trustworthy enterprise feel

---

# 5. Overall Application Structure

## 5.1 Main Screens
1. Login
2. Signup
3. Main Dashboard
4. Candidate List
5. Candidate Detail
6. Add/Edit Candidate
7. Resume Management
8. JD Intake
9. AI Matching Results
10. Tasks
11. Calendar
12. Pipeline Board
13. Reports
14. Settings / Team Management

## 5.2 Main Navigation Structure
Use a left sidebar.

### Sidebar Items
- Dashboard
- Candidates
- Jobs
- Matches
- Clients
- Calendar
- Tasks
- Reports
- AI Assistant
- Settings

### Pipeline Quick Links
Below main navigation, optionally show:
- All Candidates
- New Profiles
- Shortlisted
- Submitted
- Interview
- Offered
- Placed
- Rejected

---

# 6. End-to-End User Flow

## 6.1 Login Flow
1. User lands on login page
2. User enters credentials or SSO
3. System validates
4. If success, redirect to dashboard
5. If failure, show inline error

## 6.2 Dashboard Flow
1. User lands on dashboard
2. User sees priorities, active candidates, pending tasks, interview reminders
3. User chooses next action

## 6.3 Candidate Management Flow
1. Open candidate list
2. Search or filter candidates
3. Open candidate detail
4. Review profile, resumes, notes, stage, history
5. Update candidate record

## 6.4 Resume Management Flow
1. Open candidate
2. Go to resume section
3. Upload one or more resumes
4. Tag each resume by role/domain
5. Select best version when applying

## 6.5 JD Matching Flow
1. Open JD intake
2. Paste JD text, upload PDF, upload screenshot, or add job link
3. System parses job
4. System returns ranked matching candidates
5. Recruiter shortlists and submits

## 6.6 Task Flow
1. Open tasks
2. View pending follow-ups
3. Add/edit/complete task
4. Link task to candidate/job/interview

## 6.7 Calendar Flow
1. Open calendar
2. View scheduled calls/interviews
3. Create new event
4. Link to candidate and job
5. Status updates automatically

## 6.8 Pipeline Flow
1. Open pipeline board
2. View candidate stages
3. Move candidates between stages
4. Update progress and history

## 6.9 Reports Flow
1. Open reports
2. Review conversion, submissions, interviews, placements
3. Export or share

---

# 7. Information Architecture

## 7.1 Candidate Object
Each candidate should support:
- full name
- email
- phone
- location
- preferred location
- visa/work authorization
- total experience
- primary role
- secondary roles
- skills
- tools
- industry/domain experience
- availability
- expected rate/salary
- recruiter owner
- high-priority flag
- current stage
- notes
- resume versions
- documents
- portfolio links
- LinkedIn profile
- submission history
- interview history
- tags

## 7.2 Resume Object
Each resume should support:
- resume name
- candidate ID
- target role
- domain tag
- uploaded file
- created date
- updated date
- active/preferred marker
- usage history
- notes

## 7.3 Job Description Object
Each JD should support:
- job title
- source type
- raw input
- parsed skills
- required experience
- location
- visa constraints
- employment type
- industry relevance
- recruiter notes
- linked client
- linked shortlisted candidates

## 7.4 Task Object
Each task should support:
- title
- due date
- priority
- status
- linked candidate
- linked job
- linked interview
- owner
- notes

## 7.5 Calendar Event Object
Each event should support:
- title
- type
- date/time
- linked candidate
- linked job/client
- attendees
- notes
- reminder status

---

# 8. Dashboard Requirements

## 8.1 Dashboard Purpose
The dashboard should be **action-first**.  
It should show recruiters what needs attention now.

## 8.2 Dashboard Content Blocks
- total candidates
- high-priority candidates
- new this week
- active submissions
- interviews scheduled
- tasks due today
- AI assistant quick prompt
- recent candidate activity
- shortlist/match queue

## 8.3 Dashboard Layout
Recommended three-part layout:
1. **Left sidebar**
2. **Main center content**
3. **Right utility panel**

### Main Center Content
- page title
- search bar
- quick filters
- candidate list / action list
- tabs (All, My Candidates, High Priority, Recently Updated)

### Right Panel
- overview cards
- tasks
- AI assistant
- upcoming interviews

---

# 9. Screen-by-Screen Design Instructions

## 9.1 Login Screen
### Goal
Fast and frictionless entry.

### Layout
Use a split layout:
- Left: product story / illustration / trust points
- Right: centered login card

### Left Panel Content
- logo
- heading
- supporting value proposition
- 3 product highlights

### Right Panel Content
- sign in heading
- email field
- password field
- forgot password link
- sign in button
- SSO buttons
- sign up link

### Copy Style
Clear, short, professional.

### Important Rule
Do not overload login.

---

## 9.2 Signup Screen
### Goal
Simple account creation.

### Fields
- full name
- work email
- password
- company name
- role

### Actions
- create account
- continue with Google
- continue with Microsoft
- sign in link

### Rule
Keep signup minimal.

---

## 9.3 Candidate List Screen
### Goal
Provide fast scanning and filtering of all candidates.

### Key Components
- global search
- filter button
- saved views
- list/table toggle if needed
- candidate table
- pagination
- quick actions

### Table Columns
- candidate
- title / skills
- experience
- location
- status
- match score
- last updated
- actions

### Interaction
Selecting a row opens candidate detail drawer or detail page.

---

## 9.4 Candidate Detail Screen
### Goal
Show all candidate information in one workspace.

### Suggested Tabs
- Overview
- Resumes
- Experience
- Notes
- Submissions
- Interviews
- Documents

### Key Content
- profile header
- candidate summary
- skill chips
- resume section
- stage/status panel
- notes timeline
- linked tasks
- linked events

---

## 9.5 Resume Management Screen
### Goal
Manage multiple resumes clearly.

### Elements
- upload resume
- list of resume cards
- role/domain tags
- preferred version marker
- usage history
- download/share actions

---

## 9.6 JD Intake Screen
### Goal
Make job input flexible and easy.

### Input Methods
- paste text
- upload PDF
- upload screenshot
- paste job URL

### Output
- structured JD summary
- parsed skills
- extracted requirements
- location
- experience
- visa constraints

---

## 9.7 AI Matching Screen
### Goal
Return ranked candidates for a JD.

### Candidate Result Card Must Show
- candidate name
- role
- location
- experience
- match score
- fit reasons
- availability
- priority badge
- best resume version
- shortlist action

---

## 9.8 Tasks Screen
### Goal
Keep recruiter follow-ups visible and manageable.

### Views
- Today
- Upcoming
- Overdue
- Completed

### Task Card Fields
- title
- due date
- linked candidate/job
- priority
- status
- owner

---

## 9.9 Calendar Screen
### Goal
Track interviews and recruiter calls.

### Views
- Month
- Week
- Day
- Agenda

### Events
- interviews
- recruiter calls
- reminders
- client submissions
- follow-up deadlines

---

## 9.10 Pipeline Board
### Goal
Track candidate stage movement visually.

### Columns
- New
- Profile Updated
- Resume Prepared
- Matched
- Submitted
- Interview
- Offered
- Placed
- Rejected
- On Hold

### Candidate Card Content
- name
- role
- owner
- priority
- updated date
- short note / next step

---

## 9.11 Reports Screen
### Goal
Measure recruiting performance.

### Key Metrics
- submissions
- shortlist rate
- interview conversion
- offer conversion
- placements
- recruiter-wise performance
- high-priority candidate utilization

---

# 10. Design System Instructions

## 10.1 Visual Style
The style should match the inspiration direction:
- modern
- minimal
- soft enterprise SaaS
- premium but not flashy
- light UI
- rounded and spacious
- purple-accented

The reference style should influence:
- spacing
- card shape
- softness
- typography hierarchy
- button shapes
- icon treatment
- panel layout

The reference style should **not** dictate:
- field content
- business logic
- irrelevant labels
- copied workflows

---

# 11. Color Palette

## 11.1 Primary Palette
Use a calm purple-led system.

```txt
Primary / Brand Purple:     #5B3DF5
Primary Hover:              #4B32D4
Primary Light:              #EEE9FF
Primary Border Tint:        #D8D0FF
```

## 11.2 Neutral Palette
```txt
Background Base:            #F7F8FC
Surface / Card:             #FFFFFF
Surface Secondary:          #F3F4F8
Border Default:             #E5E7EF
Border Strong:              #D5D8E5
Text Primary:               #171A2B
Text Secondary:             #667085
Text Muted:                 #98A2B3
```

## 11.3 Semantic Colors
```txt
Success:                    #22C55E
Success Light:              #EAFBF1

Warning:                    #F59E0B
Warning Light:              #FFF4DB

Error:                      #EF4444
Error Light:                #FDECEC

Info:                       #3B82F6
Info Light:                 #EAF2FF
```

## 11.4 Status Mapping
- Open / Active → purple or green depending on meaning
- Shortlisted → blue or light info
- Interview → orange
- Submitted → blue
- Offered → purple
- Placed → green
- Rejected → red/neutral muted
- On Hold → amber/gray

---

# 12. Typography System

## 12.1 Font Family
Use:
- **Inter**
- fallback: system-ui, sans-serif

## 12.2 Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## 12.3 Type Scale
```txt
Display Large:   40px / 48px / 700
Display Medium:  32px / 40px / 700
H1:              28px / 36px / 700
H2:              24px / 32px / 700
H3:              20px / 28px / 600
H4:              18px / 26px / 600
Body Large:      16px / 26px / 400
Body Medium:     14px / 22px / 400
Body Small:      13px / 20px / 400
Caption:         12px / 18px / 500
Label:           14px / 20px / 500
Button:          14px / 20px / 600
```

## 12.4 Text Usage Rules
- Page titles: H2 or H1 depending on screen importance
- Card titles: H4
- Section labels: Label or Caption
- Helper text: Body Small
- Secondary information: Body Small or Caption
- Never use too many font sizes on a single screen

---

# 13. Layout & Spacing Rules

## 13.1 Grid System
Use an **8px spacing system**.

### Standard spacing tokens
- 4px for micro spacing only
- 8px
- 12px
- 16px
- 20px
- 24px
- 32px
- 40px
- 48px

## 13.2 Border Radius
```txt
Input Radius:        12px
Button Radius:       12px
Card Radius:         18px
Large Panel Radius:  20px
Badge Radius:        999px
```

## 13.3 Shadow System
Use soft shadows only.

```txt
Card Shadow:         0 4px 18px rgba(23, 26, 43, 0.06)
Panel Shadow:        0 10px 32px rgba(23, 26, 43, 0.08)
Dropdown Shadow:     0 8px 24px rgba(23, 26, 43, 0.10)
```

## 13.4 Container Rules
- Avoid edge-to-edge clutter
- Keep consistent internal padding
- Use generous whitespace
- Prefer clean content blocks over dense tables when possible

---

# 14. Component Guidelines

## 14.1 Buttons
### Primary Button
- Fill: brand purple
- Text: white
- Height: 44–48px
- Radius: 12px
- Font: 14px / 600

### Secondary Button
- White fill
- Border: neutral border
- Text: primary text

### Tertiary Button
- Text-only or low-contrast background

### Button Rule
Do not mix too many button styles on one surface.

---

## 14.2 Inputs
- Height: 44–48px
- Radius: 12px
- Border: neutral border
- Background: white
- Placeholder: muted text
- Focus: purple border + subtle ring

### Input States
- default
- hover
- focus
- error
- disabled

---

## 14.3 Cards
Use cards for:
- stats
- candidate previews
- task blocks
- AI assistant container
- right-side utility panels

### Card Rules
- spacious padding
- light border or shadow
- clear title/content separation
- avoid too many nested cards

---

## 14.4 Tables
Tables should feel light and modern.

### Rules
- taller rows
- soft dividers
- left-aligned content
- minimal heavy borders
- consistent avatar + text layout
- actions at right edge
- pagination simple and clean

---

## 14.5 Badges / Chips
Use pill-shaped chips.

### Types
- status chips
- skill tags
- match score categories
- role tags
- priority markers

### Rule
Skill chips should remain visually soft and scannable.

---

## 14.6 Sidebar
### Sidebar Style
- light background
- subtle separation from main area
- icons + labels
- active state uses purple tint or subtle highlight
- generous spacing
- fixed width between 240px and 280px

---

## 14.7 Top Navigation
Should include:
- global search
- optional keyboard hint
- add candidate button
- notifications
- user profile menu

---

## 14.8 Right Utility Panel
Should contain:
- overview stats
- task widget
- AI assistant
- upcoming interviews

Keep it calm and compact.

---

# 15. Candidate Data UI Rules

## 15.1 Candidate List Priority
The candidate list should allow recruiters to answer:
- Who is best?
- Who is available?
- Who is high priority?
- What changed recently?
- Who fits the current job?

## 15.2 Candidate Row Structure
Include:
- avatar
- name
- current role
- core skills
- experience
- location
- status
- score
- updated timestamp
- quick menu

## 15.3 Candidate Detail Header
Include:
- candidate name
- location
- availability
- years of experience
- expected compensation
- action buttons
- priority flag

---

# 16. AI Assistant Instructions

## 16.1 AI Assistant Purpose
The AI assistant is not decorative.  
It is an **action support tool**.

It should help recruiters:
- match candidates to jobs
- find the best available candidate set
- identify missing profile data
- recommend the best resume version
- surface high-priority candidates
- answer operational queries

## 16.2 AI Assistant Placement
Place on dashboard and matching-related screens.  
Also support expanded assistant workspace.

## 16.3 AI Assistant Input Modes
- natural language prompt
- JD paste
- job link
- screenshot upload
- PDF upload

## 16.4 Example Prompts
- Find top 5 candidates for this JD
- Show Python candidates with banking experience
- Who is available immediately in New York?
- Which resume version is best for this role?
- Show high-priority candidates suitable for DevOps roles

## 16.5 Assistant UI Guidelines
- clear input box
- attach/upload options
- example prompt chips
- concise results
- allow action continuation from output

## 16.6 Assistant Behavior Rules
- results must be explainable
- show why a candidate matched
- never overwhelm with large walls of text
- prioritize action buttons
- highlight missing or weak data

---

# 17. Content & Copy Guidelines

## 17.1 Tone
- professional
- clean
- confident
- concise
- friendly enterprise SaaS

## 17.2 Copy Rules
- avoid jargon overload
- avoid long paragraphs in UI
- use direct action text
- prefer “Add Candidate” over vague wording
- prefer “Match to JD” over “Run AI analysis”

## 17.3 Empty State Rules
Every empty state should explain:
- what this area is,
- why it matters,
- what to do next.

---

# 18. Interaction Rules

## 18.1 General Interaction
- hover should be subtle
- active states should be clear
- transitions should be fast and light
- avoid over-animation

## 18.2 Motion
If motion is used:
- 150ms to 250ms ease
- soft fade/slide only
- no distracting bouncing

## 18.3 Drawers vs Pages
Use drawers for:
- quick candidate detail
- editing small data
- quick notes/tasks

Use full pages for:
- detailed candidate profile
- JD matching flow
- reports
- settings

---

# 19. Accessibility Guidelines

## 19.1 Contrast
Maintain readable contrast for:
- text on white
- muted text
- status chips

## 19.2 Keyboard Support
Ensure:
- tab navigation
- visible focus states
- accessible forms
- accessible dropdowns and modals

## 19.3 Readability
- minimum body size 14px for key workflows
- avoid overly light text for important information

---

# 20. Responsive Guidelines

## 20.1 Desktop First
This product is primarily desktop-first.

## 20.2 Tablet
Support clean stacking behavior.

## 20.3 Mobile
Mobile can be limited for MVP, but ensure:
- sidebar collapses
- tables adapt
- utility panel stacks below content

---

# 21. Validation Wireframe Sequence

## Phase 1
- Login
- Signup
- Dashboard shell
- Sidebar
- Topbar

## Phase 2
- Candidate list
- Candidate detail
- Add candidate
- Resume management

## Phase 3
- JD intake
- AI matching
- AI assistant expanded view

## Phase 4
- Tasks
- Calendar
- Pipeline

## Phase 5
- Reports
- Settings

---

# 22. Build Order Recommendations

## 22.1 Design Order
1. Design system
2. Login/signup
3. Dashboard shell
4. Candidate list
5. Candidate detail
6. Resume management
7. JD intake
8. AI matching
9. Tasks/calendar
10. Pipeline
11. Reports/settings

## 22.2 Development Order
1. App shell
2. authentication
3. design system components
4. dashboard layout
5. candidate CRUD
6. resume management
7. task/calendar modules
8. JD intake
9. AI matching integration
10. reporting

---

# 23. What Must Stay Consistent Across All Screens
- same color language
- same typography scale
- same card radius
- same button system
- same input system
- same badge rules
- same spacing rhythm
- same icon style
- same table rhythm
- same search/filter behavior

---

# 24. What the AI Design Agent Must Not Do
- do not copy the reference screen literally
- do not reuse irrelevant field structures
- do not overload forms
- do not add too many charts
- do not make the interface visually noisy
- do not use harsh shadows
- do not use too many accent colors
- do not build a generic HRMS; build a recruiter workflow tool
- do not sacrifice clarity for visual complexity

---

# 25. Final AI Agent Prompting Guidance

Use the following intent when generating screens:

> Design a modern recruitment management dashboard for recruiters managing 50–100+ IT candidates. The product should feel clean, premium, calm, and action-first. Use a soft light SaaS interface with rounded white cards, subtle shadows, purple accents, generous whitespace, and strong table/list usability. The design must prioritize candidate tracking, resume management, job matching, tasks, interviews, and recruiter productivity. Follow the provided design system exactly, including color palette, typography scale, spacing system, and component behavior. Use the reference only as visual inspiration for layout softness and UI polish, not for business logic or field content.

---

# 26. Deliverables Expected From Design Agent
The design agent should produce:
1. low-fidelity wireframes,
2. high-fidelity UI screens,
3. component specs,
4. screen states,
5. interaction notes,
6. responsive behavior notes,
7. development-ready structure.

---

# 27. Deliverables Expected From Build Agent
The build agent should produce:
1. reusable component library,
2. app shell,
3. screen layouts,
4. sample data structures,
5. candidate management flows,
6. state management structure,
7. API integration placeholders,
8. AI assistant integration points.

---

# 28. Final Summary
This application is a **recruitment operations dashboard**, not a generic admin panel.

The design should feel:
- clean,
- modern,
- professional,
- recruiter-first,
- and operationally powerful.

The validation focus is:
- centralized candidate management,
- structured resume handling,
- JD matching,
- recruiter workflow support,
- and high clarity across the full recruiting pipeline.
