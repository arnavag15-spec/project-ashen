# Project Ashen Crown

> **Restore a war-torn Sengoku-inspired province by conquering the digital chores you have been putting off.**

---

## ⚔️ Overview & Hackathon Problem Statement

### The Problem
We all procrastinate on painful, repetitive digital chores—cleaning unread inboxes, untangling messy downloads folders, fixing linter errors, and reviewing expense receipts. These chores feel dull, unrewarding, and cognitively draining.

### The Solution
**Project Ashen Crown** turns expense review into a purposeful, narrative kingdom-management game set in the fictional late-medieval province of **Arahama**. You inherit a divided province facing an approaching northern invasion. To commission defensive ramparts, food silos, and river bazaars, you must consult **The Steward's Ledger** and organise a real expense CSV file.

The app never fakes or simulates the chore:
- It genuinely parses, normalises, auto-categorises, and flags potential duplicates in your uploaded CSV.
- Your personal financial data is processed **strictly in the browser**—never sent to a backend or external API.
- Completing the chore milestones unlocks **Stewardship Seals** that fund tangible province upgrades, directly deciding whether Arahama survives the invasion.

---

## 🌟 Core Features & Gameplay Concept

1. **Chapter I: The Inheritance of Ashes (Complete Playable Narrative):**
   - **Scene 1 (Prologue):** Lord Harun returns to the seat of Arahama following his father's passing.
   - **Scene 2 & 3 (The War Council):** Deliberate between Lord Daigo (veteran commander) and Lady Aki (royal steward). Make two high-stakes decisions:
     - *Strategic Focus:* Secure the northern frontier vs. Protect valley villages.
     - *The Exile:* Welcome back Lord Renji with northern enemy intelligence vs. Uphold his exile.
   - **Scene 4 (The Settlement):** Manage three provincial structures: **Highland Granary**, **Crest Watchtower**, and **River Marketplace**.
   - **Scene 5 (The Northern Pass):** Climax confrontation with dynamic outcome determined by an invasion readiness formula.

2. **The Steward's Ledger (P0 Chore Engine):**
   - **Client-Side CSV Parsing:** Powered by Papa Parse. Supports single-column amounts (positive/negative) or split Debit/Credit columns, dates, and descriptions.
   - **Interactive Column Mapping:** Auto-detects common banking export headers case-insensitively, with a manual mapping fallback interface.
   - **Deterministic 10-Category Classification Engine:** Transparent keyword-rule classifier assigning categories across *Food & Groceries*, *Transport*, *Shopping*, *Bills & Utilities*, *Education*, *Health*, *Entertainment*, *Income & Refunds*, *Transfers*, and *Other / Needs Review* with confidence ratings (`high`, `medium`, `low`).
   - **Conservative Duplicate Detection:** Flags matching `date + amount + description` pairs. Never auto-excludes entries without explicit user choice (`Keep` vs. `Exclude`).
   - **Persistent Review Workspace:** Paginated at 25 rows per page with filter chips (*All*, *Needs Review*, *Possible Duplicates*, *Reviewed*, *Excluded*). User modifications survive filtering and page changes.
   - **Safe CSV Export:** Downloads a newly generated CSV file preserving all original columns and cell values, while appending category, review status, and duplicate annotations. Only user-confirmed duplicates are excluded.

3. **Kingdom Economy Separation & Milestone Progression:**
   - **Economy Separation:** Personal transaction amounts and spending figures are strictly separated from kingdom metrics and never converted into game gold, food, or soldiers.
   - **Stewardship Seals:** Up to 3 seals are earned solely through genuine chore milestones:
     - *Seal 1 (Ledger Opened):* Awarded upon importing a personal CSV or loading the built-in sample dataset.
     - *Seal 2 (Accounts Ordered):* Awarded once the categorisation pass completes.
     - *Seal 3 (Ledger Settled):* Awarded after reviewing uncertain entries, resolving duplicates, and downloading the cleaned CSV.
   - Each seal funds one building upgrade.

4. **Transparent Invasion Readiness Formula:**
   $$\text{Readiness} = \text{round}(0.40 \times \text{Defence} + 0.25 \times \text{Food} + 0.20 \times \text{Public Trust} + 0.15 \times \text{Treasury})$$
   - **The Dawn of a New Era ($\ge 60$):** Resolute victory; the enemy vanguard is shattered and the province holds.
   - **A Costly Victory ($45\text{--}59$):** The invasion is repelled, but severe shortages strain the realm.
   - **The Ashen March ($< 45$):** Defensive perimeter breaks; Harun retreats south to fight another day.

---

## 🔒 Privacy & Data Security

- **100% In-Browser Client Execution:** All CSV parsing, keyword classification, duplicate detection, and file generation run entirely inside your browser's local JavaScript runtime.
- **Zero Remote Storage:** No database, no Supabase, no authentication system, and no analytics trackers.
- **No Third-Party AI Data Transmission:** Categorisation relies on deterministic in-memory keyword heuristics; transaction descriptions and balances are never sent to external AI APIs.
- **File Integrity:** The application reads files via the standard HTML5 File API and never mutates or overwrites your original source file.

---

## 🛠️ Technology Stack

- **Framework:** React 18 with TypeScript 5
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3 (custom Sengoku historical palette: dark charcoal `#0c0c0e`, weathered parchment `#f4ede2`, muted bronze `#b88d36`, restrained vermilion `#dc2626`)
- **CSV Parser & Writer:** Papa Parse 5
- **Icons:** Lucide React
- **Test Runner:** Vitest (39 unit and integration tests)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; developed and verified on Node.js v26)
- npm (v9 or higher)

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/arnavag15-spec/project-ashen-crown.git
cd project-ashen-crown
npm install
```

### Local Development
To launch the Vite development server:

```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Running Automated Tests
Run the complete unit and integration test suite:

```bash
npm test
```
*Current test suite: 39 tests passing across CSV parsing, amount normalisation, categorisation rules, duplicate detection, game state rules, and end-to-end user journeys.*

### Production Build
To create a production-ready bundle:

```bash
npm run build
```
Build outputs are generated in the `dist/` directory. You can preview the production build locally with:

```bash
npm run preview
```

---

## 📋 Known Limitations

- **Session In-Memory Scope:** For user privacy, transaction rows exist strictly in volatile browser memory during the active session. Refreshing the browser tab clears the active session.
- **Single Chapter Scope:** Chapter I is a self-contained hackathon MVP. The ending cinematic resolves Chapter I rather than transitioning to an unfinished Chapter II.

---

## 📜 License

MIT License. Designed and developed for the AI Agentic Hackathon.
