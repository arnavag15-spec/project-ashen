# PROJECT ASHEN CROWN
## Game Design Document + MVP Technical Specification + Antigravity Prompt Pack

**Status:** Hackathon MVP draft  
**Target build time:** 6–8 hours, one developer, beginner-friendly AI-assisted workflow  
**Working title:** *Project Ashen Crown*  
**Genre:** Narrative kingdom-management game with a real expense-organisation task  
**Platform:** Responsive browser app  
**Primary success criterion:** The app genuinely imports, categorises, lets the player review, and exports an expense CSV. The story and kingdom systems make completing that chore feel like progressing through a game.

> Names, story details, stat values, and visual direction below are a strong first draft—not irreversible decisions. Preserve the agreed concept, but keep the implementation easy to revise.

---

# 1. Product definition

## 1.1 One-sentence pitch

**Restore a war-torn Sengoku-inspired province by completing the digital chores you have been putting off.** In the first chapter, the player inherits a divided province, makes difficult leadership decisions, and uses the Steward's Ledger to organise a real expense CSV while preparing for an approaching invasion.

## 1.2 The problem being solved

People procrastinate on repetitive digital chores because they feel dull, effortful, and unrewarding. Ashen Crown turns one such chore—reviewing and organising expenses—into a purposeful activity inside a short narrative game.

The game must not pretend to perform the chore. The user must see their own CSV parsed, categories assigned, uncertain entries flagged, corrections applied, and a new reviewed CSV downloaded.

## 1.3 Design pillars

1. **The chore is real.** Expense processing is the product's functional core, not a fake progress bar or a simulated task.
2. **The story gives the task meaning.** Ledger milestones unlock scenes and stewardship actions; the user's spending amounts never become kingdom resources.
3. **Choices have consequences.** Decisions affect kingdom readiness and character relationships. No single arbitrary choice should secretly guarantee failure.
4. **Small world, strong atmosphere.** One settlement, three buildings, four main characters, one complete chapter. Make this feel coherent before making it large.
5. **Trust and user control.** Process the file locally in the browser, preserve source data, disclose what is happening, and never silently delete transactions.

## 1.4 Target experience

A player should be able to:
- Understand the story and make an initial leadership decision in under two minutes.
- Upload their own expense CSV, or choose a clearly labelled sample file for a demo.
- See transactions organised into understandable categories.
- Review uncertain classifications and possible duplicates.
- Export a new reviewed CSV without changing the original file.
- See the task's completion unlock concrete in-game progress and a chapter ending.

---

# 2. World, tone, and narrative

## 2.1 Setting

A fictional province called **Arahama**, in a fictional Sengoku-inspired world. The atmosphere may draw on broad late-medieval Japanese imagery: mountain castles, wooden settlements, rice terraces, temples, misty passes, autumn forests, rival clans, fragile alliances, and contested succession.

This is an original setting. Do not copy Sekiro's characters, locations, names, plot, dialogue, designs, or distinctive assets. Aim for a melancholic, cinematic atmosphere—not a recreation of another game.

**Visual vocabulary:** weathered timber, dark ink, smoke, parchment, muted iron, autumn red, tarnished brass, mountain mist, lantern light, worn banners. Use original CSS/SVG compositions and simple silhouettes if bespoke artwork is unavailable. Do not block implementation waiting for art assets.

## 2.2 Premise

The old lord of Arahama has died. His young heir returns to inherit a province weakened by years of conflict. The treasury is depleted, harvests are poor, villages are losing faith in the ruling house, the military is divided, and an enemy clan is gathering near the northern border.

The new lord must unite the province before the invasion. The central question is:

**Can a young ruler unite a divided province before the northern army arrives—and what will be sacrificed to do it?**

## 2.3 Main cast (provisional)

| Character | Role and worldview | Central tension |
|---|---|---|
| **Lord Harun** | Player character; young heir, inexperienced but not defined in advance by the game as weak or foolish. | Must decide whether to preserve his father's legacy or build a different kind of rule. |
| **Lord Daigo** | Veteran commander and long-serving retainer. Values discipline, military strength, loyalty, and continuity. | His loyalty is real, but his attachment to the old order can make him resistant to change. |
| **Lady Aki** | Royal steward responsible for administration, stores, agriculture, and the treasury. Values stability and the welfare of ordinary people. | Must balance practical compromise against the risk of becoming politically powerless. |
| **Lord Renji** | Former retainer, exiled years ago under disputed circumstances. Returns with information about the enemy. | Could be seeking redemption, influence, or revenge; the player should not know immediately which. |

The characters must have distinct voices and understandable motives. Avoid making one character obviously right and the others foolish. They should disagree because they value different things.

## 2.4 Chapter I — The Inheritance of Ashes

**Chapter line:** “A lord is dead. A province is divided. And a young heir must decide what is worth saving.”

**Chapter objective:** Prepare Arahama to survive the approaching northern invasion.

### Scene 1 — The Return

Harun arrives at the provincial capital for his father's funeral. The castle is worn, the treasury is nearly empty, and the mood among the retainers is uncertain. Daigo pledges military loyalty. Aki presents the province's condition. The northern threat is introduced.

### Scene 2 — The Council

The player must choose where the province's remaining attention and resources go first:

- **Secure the frontier:** repair the northern watchtower and defensive works. This increases Defence, but villages remain exposed to food shortages.
- **Protect the villages:** restore granaries and irrigation. This improves Food Security and Public Trust, but leaves the northern frontier weaker.

Both options must be presented as defensible decisions. Do not label one as the correct choice.

### Scene 3 — The Exile Returns

Renji returns with intelligence about the approaching enemy. Daigo distrusts him; Aki argues that the province cannot afford to ignore useful information.

- **Welcome Renji:** gain his intelligence and a defensive advantage; Daigo's confidence decreases.
- **Refuse his return:** Daigo's confidence improves; Renji leaves, and the province loses a potential ally and some intelligence.

The choice should alter Renji's relationship and the later invasion narration, not simply switch the story to a different path.

### Scene 4 — The Province Awakens

The player views one small settlement and three upgradeable buildings:

- **Granary:** improves Food Security and slightly improves Public Trust.
- **Watchtower:** improves Defence.
- **Marketplace:** improves Treasury and slightly improves Public Trust.

The player earns up to three **Stewardship Seals** from task milestones: importing a CSV, completing the automatic categorisation pass, and finishing review plus export. Each seal enables one building upgrade. These are fictional progression tokens; they are not derived from the user's spending or transaction values.

The expense workflow appears in-world as **The Steward's Ledger**. Explain clearly that this is the player's personal expense file being organised locally—not the kingdom's actual accounts.

### Scene 5 — The Northern Pass

Scouts report that the enemy has crossed the pass. Daigo prepares the soldiers, Aki coordinates supplies, and Renji (if welcomed) offers an alternative defensive plan. Resolve the confrontation with a short, authored cinematic scene and an outcome calculated from the player's accumulated kingdom state.

Do not build real-time combat for this MVP. The climax is a narrative resolution, not a combat system.

## 2.5 Chapter endings

Use three outcome tiers:

- **The Dawn of a New Era:** the enemy is repelled and the province remains resilient. The cast recognises Harun's leadership, while later dialogue reflects the choices made.
- **A Costly Victory:** the enemy is repelled, but the province suffers serious losses, strained supplies, or damaged trust. Chapter II would begin under pressure.
- **The Ashen March:** the defence breaks. Harun retreats, northern settlements are lost, and a trusted character may be captured or separated from the group. The story continues from a much worse position rather than simply stopping with a generic game-over screen.

Use thresholds on a combined readiness score, not a single choice. Character relationships can add a small narrative modifier or affect epilogue dialogue, but should not make the score opaque.

---

# 3. Game systems and balancing rules

## 3.1 Kingdom state

Maintain four visible values, each clamped from 0 to 100:

- **Food Security** — ability to feed settlements and sustain a long defence.
- **Defence** — walls, scouts, readiness, and defensive position.
- **Public Trust** — willingness of villages and local leaders to support the ruling house.
- **Treasury** — remaining administrative and trade capacity.

Maintain three relationship values, also clamped from 0 to 100:

- **Daigo's Loyalty**
- **Aki's Confidence**
- **Renji's Trust**

Suggested starting kingdom values:

| Stat | Starting value |
|---|---:|
| Food Security | 42 |
| Defence | 40 |
| Public Trust | 45 |
| Treasury | 35 |

Suggested starting relationships:

| Relationship | Starting value |
|---|---:|
| Daigo | 65 |
| Aki | 60 |
| Renji | 20 (not yet present) |

Suggested choice effects (fine-tune after testing):

| Decision | Food | Defence | Public Trust | Treasury | Relationship effect |
|---|---:|---:|---:|---:|---|
| Secure the frontier | -5 | +20 | -2 | -8 | Daigo +8, Aki -3 |
| Protect the villages | +20 | -5 | +8 | -8 | Aki +8, Daigo -3 |
| Welcome Renji | 0 | +8 | 0 | 0 | Renji +25, Daigo -10 |
| Refuse Renji | 0 | -5 | 0 | 0 | Daigo +10, Renji -25 |

Building effects (each building can be upgraded once in this chapter):

| Building | Effect |
|---|---|
| Granary | Food Security +14, Public Trust +4 |
| Watchtower | Defence +14 |
| Marketplace | Treasury +10, Public Trust +3 |

Clamp all values to 0–100. Keep stat changes in one central game-logic module rather than scattering magic numbers through UI components.

## 3.2 Invasion calculation

A transparent, simple formula is preferable to a complicated simulation:

`readiness = round(0.40 × Defence + 0.25 × Food Security + 0.20 × Public Trust + 0.15 × Treasury)`

Suggested outcome tiers:
- `readiness >= 60`: Dawn of a New Era.
- `readiness >= 45 and < 60`: A Costly Victory.
- `readiness < 45`: The Ashen March.

With the suggested starting values and all three buildings upgraded, the frontier + welcome path scores about 60.3 (Dawn); frontier + refuse scores about 55.1 (Costly); and villages + welcome scores about 53.8 (Costly). A villages + refuse path with no building upgrades scores about 42.2 (Ashen March). These examples make all three tiers reachable without one decision alone determining the ending. Recheck the arithmetic if you change any stat effects.

Use relationship values and the Renji decision to alter specific lines, support scenes, or consequences—not to arbitrarily override the main tier. Display a short explanation of why the outcome occurred (for example, “The watchtower held, but the villages could not sustain the defence”).

## 3.3 Stewardship Seals and task progression

- **Seal 1 — The Ledger is opened:** awarded after a valid CSV is loaded (or the clearly labelled sample dataset is loaded).
- **Seal 2 — The Accounts are ordered:** awarded after the automatic categorisation pass has completed and every transaction has a suggested category.
- **Seal 3 — The Ledger is settled:** awarded after all low-confidence items are reviewed, all possible duplicates have an explicit Keep/Exclude decision, and a reviewed CSV has been exported.

One seal unlocks one building upgrade. The player may choose which building to improve. Do not reward larger expenses, more transactions, or higher spending. Do not convert currency amounts into food, soldiers, gold, or any other game value.

If there are no uncertain transactions or duplicate flags, the player should be able to complete the review step by confirming the review summary. Never invent review tasks just to delay progression.

---

# 4. Expense workflow — functional requirements

This is the highest-priority feature. Build and test it before implementing elaborate story visuals.

## 4.1 Import and privacy

- Accept `.csv` files through a file input and drag-and-drop area if time permits.
- Provide a **Try sample ledger** option using a small fictional sample CSV. Clearly label it as sample/demo data; never imply it is the user's real data.
- Parse in the browser. Do not upload transaction data to a server, third-party AI API, analytics tool, or Supabase.
- Show a short notice: “Your CSV is processed in this browser. It is not uploaded. The original file is not changed.” Only make the local-processing claim if the implementation truly has no network transmission of file contents.
- Provide a clear **Remove file / Clear ledger** action that clears in-memory rows and resets ledger state.
- Do not log transaction descriptions, account details, or raw CSV content to the console.

## 4.2 Supported CSV structure

Support common bank/export files with a header row. Try to detect these headers case-insensitively:

- Date: `date`, `transaction date`, `posting date`, `value date`
- Description: `description`, `details`, `narration`, `merchant`, `payee`, `name`, `particulars`
- Amount: `amount`, `transaction amount`, `value`
- Debit: `debit`, `withdrawal`, `spent`, `outflow`
- Credit: `credit`, `deposit`, `received`, `inflow`
- Existing category: `category`, `type`

Rules:
- Date is optional.
- A usable description column and either a single amount column or debit/credit columns are required.
- If the importer cannot confidently map the required columns, show a small column-mapping step instead of guessing silently.
- Support one amount column and separate debit/credit columns. With separate columns, derive transaction direction from which column has a value. With one amount column, preserve the original sign and let the user choose/confirm whether positive values represent expenses or income when the convention is ambiguous.
- Preserve every original column and original cell value for export. Add normalised fields for the app without overwriting the originals.
- Do not perform currency conversion. Do not assume all files use INR just because the demo is in India.
- Reject an empty file, malformed CSV, or file with no usable rows with a clear human-readable message.

Use a browser CSV parser such as Papa Parse if it fits the existing project. Do not hand-write a fragile CSV parser that breaks on quoted commas or embedded line breaks.

## 4.3 Categories

Use a short, editable default set:

1. Food & Groceries
2. Transport
3. Shopping
4. Bills & Utilities
5. Education
6. Health
7. Entertainment
8. Income & Refunds
9. Transfers
10. Other / Needs Review

Implement a transparent, deterministic keyword-rule categoriser. No external AI call is needed for the MVP.

Examples of rule signals:
- Food & Groceries: grocery, supermarket, restaurant, cafe, food delivery, bakery.
- Transport: taxi, cab, ride, fuel, petrol, metro, bus, train, flight, parking.
- Shopping: online store, clothing, electronics, general retail.
- Bills & Utilities: electricity, water, gas, broadband, internet, phone, recharge.
- Education: tuition, college, university, course, books, stationery.
- Health: pharmacy, hospital, clinic, medical, dentist.
- Entertainment: cinema, movie, streaming, music subscription, game purchase.
- Income & Refunds: salary, wages, refund, reimbursement, interest received.
- Transfers: transfer, UPI transfer, bank transfer, self transfer (avoid assuming a payment app name alone means a transfer).

Return a suggested category and confidence level (`high`, `medium`, or `low`). Keyword matches with a specific signal may be high; weak/general matches medium; no reliable match low and set to `Other / Needs Review`. Do not claim that heuristic categorisation is always correct.

Allow the user to change any category manually. A manual correction must survive pagination, filtering, and export.

## 4.4 Review and duplicate handling

- Show transaction rows with date (when available), description, amount/direction, category, confidence/review status, and duplicate status.
- Provide filters such as All, Needs Review, Possible Duplicates, and Reviewed.
- Use pagination (e.g. 25 rows per page) so a 5,000-row file does not render thousands of DOM rows at once.
- Flag potential duplicates conservatively using a normalised match on date + amount + description. If there is no date column, skip automatic duplicate detection rather than creating unreliable flags.
- A duplicate flag is a suggestion, not a conclusion. Never auto-delete or auto-exclude a row.
- For each possible duplicate, make the user explicitly choose **Keep** or **Exclude from cleaned export**. Default should be Keep/unresolved.
- A row can be manually reviewed by confirming or changing its category. Uncertain classifications must remain visibly unresolved until reviewed.
- Show summary counts: total transactions, auto-categorised, needs review, possible duplicates, excluded from export.

## 4.5 Export

- Download a new reviewed CSV; never overwrite the original file.
- Preserve original columns and original values, then append fields such as `Suggested/Final Category`, `Review Status`, and `Potential Duplicate` (and optionally `Export Decision`).
- Exclude a duplicate only when the user explicitly selected **Exclude from cleaned export**. Make the number excluded visible before export.
- Use a proper CSV writer/escaping function; descriptions may contain commas, quotes, or line breaks.
- Show a clear completion message and a fresh download action. Do not claim export succeeded until the browser download action has actually been triggered.

## 4.6 Edge cases to test

- UTF-8 text and Indian merchant names.
- Quoted descriptions containing commas.
- Empty rows.
- Amounts with commas, decimal points, a leading minus sign, or currency symbols.
- Missing optional date column.
- Duplicate candidates with identical date/description/amount.
- Same merchant and amount on different dates (should not be flagged as exact duplicates).
- No uncertain rows and no duplicate rows.
- All rows manually edited.
- 5,000 rows without an unresponsive UI.

---

# 5. MVP screens and user flow

Keep navigation simple. A state-driven single-page app is enough; do not add a complex routing system unless the project already has one.

## Screen 1 — Title / Prologue
- Project title and short atmospheric line.
- One primary **Begin** action.
- Briefly establish that this is a story about rebuilding a province and facing a looming invasion.

## Screen 2 — The Council
- Scene narration and character dialogue.
- First decision: Secure the frontier / Protect the villages.
- Second decision: Welcome Renji / Refuse Renji.
- Clearly show the consequence preview in plain language, not exact hidden formulas.

## Screen 3 — Settlement
- One visual settlement panel/map with three clickable building cards: Granary, Watchtower, Marketplace.
- Four kingdom stats and three relationship indicators.
- Show Stewardship Seals earned/available and what each building upgrade changes.
- No free-roaming character movement or real-time battle.

## Screen 4 — The Steward's Ledger
- CSV upload, sample-data button, privacy note, import/mapping step, transaction table, category review, duplicate decisions, progress summary, export.
- This screen must be usable and visually clear before additional animation work.

## Screen 5 — Northern Pass / Chapter Ending
- Short cinematic narration based on the readiness tier.
- Character-specific lines reflect the Renji decision and relationship values.
- Show the final kingdom stats and a concise explanation of the outcome.
- Add a **Play chapter again** reset action. Do not imply Chapter II has been built.

## Recommended journey

Title → Council choice 1 → Council choice 2 → Settlement → Ledger import → automatic categorisation → review/duplicate decisions → export → use remaining seals to upgrade buildings → Northern Pass outcome.

The player may visit Settlement and Ledger screens more than once. Store the game session in React state; optional session persistence is acceptable only if it does not store raw financial rows unnecessarily. Prefer not to persist the CSV itself to localStorage.

---

# 6. Visual and interaction direction

## 6.1 Art direction

Aim for a polished, restrained dark-fantasy historical atmosphere:
- Deep charcoal/ink background, weathered parchment surfaces, muted bronze/gold accents, restrained vermilion for warnings.
- Large serif display typography for chapter titles; highly readable sans-serif for tables, controls, and utility text.
- Layered panels, subtle borders, soft atmospheric gradients, fine map-line details, lantern-like highlights.
- Strong hierarchy: story should feel cinematic; data tables must remain highly readable.
- Use motion sparingly: scene fade, gentle stat transitions, small building upgrade feedback. Respect reduced-motion preferences.

Avoid:
- Generic neon cyberpunk styling.
- Excessive gold gradients, glowing borders, random icons, or decorative clutter.
- Tiny text, low-contrast grey-on-grey tables, or fancy interactions that slow down CSV review.
- Copying Sekiro or another game's exact UI/artwork.

## 6.2 Responsive and accessible behaviour

- Optimise first for a typical laptop judging/demo screen, but make the layout usable on mobile widths.
- All actions must work with keyboard and mouse.
- Give file input and category controls visible labels.
- Use clear focus states and accessible text contrast.
- Never communicate status with colour alone; include labels/icons/text.
- Show loading and error states for import/export where applicable.

---

# 7. Technical implementation specification

## 7.1 Preferred stack

- **Vite + React + TypeScript** for a small, fast browser app.
- **Tailwind CSS** for styling if the starter project is empty and Tailwind can be added cleanly. If the workspace already has a working styling system, keep it rather than replacing it.
- **Papa Parse** (or another maintained browser-side parser already available) for CSV parsing.
- **Lucide React** icons if already available or easy to add.
- **Vitest** for lightweight unit tests of CSV categorisation, duplicate detection, game calculations, and export logic if time permits.
- Deploy as a static site (for example, Vercel) only after the app works locally.

No backend, Supabase, authentication, database, account system, AI API, or cloud file storage is required for this MVP.

## 7.2 Architecture

Keep boundaries clear without overengineering:

```text
src/
  app/
    App.tsx
    appState.ts                 # high-level screen / navigation state if needed
  components/
    AppShell.tsx
    StatBar.tsx
    CharacterDialogue.tsx
    ChoiceCard.tsx
    BuildingCard.tsx
    TransactionTable.tsx
    StatusBadge.tsx
    EmptyState.tsx
  features/
    story/
      storyData.ts              # authored scenes and dialogue
      StoryScreen.tsx
    kingdom/
      gameTypes.ts
      gameRules.ts              # initial state, choice/building effects, clamp
      ending.ts                 # readiness formula and ending selection
      SettlementScreen.tsx
    ledger/
      ledgerTypes.ts
      detectColumns.ts
      parseCsv.ts
      categorize.ts
      findDuplicates.ts
      exportCsv.ts
      LedgerScreen.tsx
      ImportMapping.tsx
      ReviewPanel.tsx
  data/
    sampleExpenses.csv
  styles/
    index.css
  test/                         # or colocated *.test.ts files
```

This is a suggested structure, not a mandate. Prefer the smallest structure that keeps story logic, game logic, and CSV logic separate. Do not create an abstraction for every button.

## 7.3 Core types (illustrative)

```ts
type Category =
  | 'Food & Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Education'
  | 'Health'
  | 'Entertainment'
  | 'Income & Refunds'
  | 'Transfers'
  | 'Other / Needs Review';

type Confidence = 'high' | 'medium' | 'low';
type DuplicateDecision = 'keep' | 'exclude' | null;

type Transaction = {
  id: string;
  original: Record<string, string>;
  date: string | null;
  description: string;
  amount: number | null;
  direction: 'expense' | 'income' | 'unknown';
  category: Category;
  confidence: Confidence;
  categoryReviewed: boolean;
  duplicateOf: string | null;
  duplicateDecision: DuplicateDecision;
};

type KingdomStats = {
  food: number;
  defence: number;
  publicTrust: number;
  treasury: number;
};

type Relationships = {
  daigo: number;
  aki: number;
  renji: number;
};

type GameState = {
  stats: KingdomStats;
  relationships: Relationships;
  firstCouncilChoice: 'frontier' | 'villages' | null;
  renjiChoice: 'welcome' | 'refuse' | null;
  upgradedBuildings: string[];
  stewardshipSeals: number;
  ledgerMilestones: {
    imported: boolean;
    categorised: boolean;
    reviewedAndExported: boolean;
  };
};
```

Adapt types to the actual code. Preserve the underlying rules and data-safety requirements.

## 7.4 State management

- React state/useReducer is sufficient.
- Keep financial rows in memory only for the active session.
- Centralise game mutations in reducer/actions or game rules functions.
- Do not let UI components directly change unrelated stats.
- Derive counts, filtered rows, readiness, and ending from source state; avoid duplicate state that can drift out of sync.
- Ensure row edits are immutable so filters and pagination do not reset or lose user changes.

## 7.5 Quality gates

Before calling the MVP complete, verify:
1. `npm run dev` starts without errors.
2. `npm run build` succeeds.
3. A real CSV upload works end to end.
4. The sample CSV works end to end.
5. Categories can be manually corrected and remain corrected after filtering/page changes.
6. Potential duplicates require explicit user decisions.
7. Export downloads a valid CSV with source columns retained.
8. No file contents are sent to a server or API.
9. All game choices/building upgrades update the intended values exactly once.
10. All three endings can be reached through test states or choice combinations.
11. No primary button is decorative or inert.
12. The layout remains usable at laptop and mobile widths.

---

# 8. Scope control and 6–8 hour build plan

## Priority order

**P0 — Must work:** CSV import, automatic categorisation, manual category review, duplicate review, CSV export, privacy handling.  
**P1 — Must tell a complete story:** title, two council choices, settlement with three upgrades, one chapter ending, four kingdom stats, relationship changes.  
**P2 — Polish if time remains:** richer illustrations, subtle transitions, sound, extra dialogue, improved mobile layout.

Do not begin P2 until P0 works end to end.

## Suggested time budget

| Elapsed time | Focus | Exit condition |
|---|---|---|
| 0:00–0:30 | Inspect workspace, scaffold, app shell | App runs; design tokens and screen skeleton exist |
| 0:30–2:30 | CSV import, detection, categorisation, review, export | A real CSV can be processed and downloaded |
| 2:30–3:30 | Game state, decisions, buildings, endings | Choices and all stats/outcomes work without visual polish |
| 3:30–5:00 | Story screens and settlement UI | One coherent playable chapter exists |
| 5:00–6:15 | Integrate ledger with seals/story progression | Task milestones genuinely unlock game progression |
| 6:15–7:15 | Test, edge cases, responsive cleanup | Build and key user journey pass |
| 7:15–8:00 | Final polish and demo rehearsal | Stable 2–3 minute demo path |

If time is running short, remove optional visuals and extra dialogue before reducing CSV correctness or export reliability.

---

# 9. Antigravity operating instructions

## How to use this pack

1. Create/open one project folder in Antigravity for the app. Use a clean folder or the existing hackathon repository; do not let the agent overwrite unrelated files.
2. Give the agent the project rules below (as workspace rules if convenient, or paste them at the start of the conversation).
3. Send the prompts in Sections 10–14 **one at a time**. Inspect the result after each stage. Do not paste all prompts at once.
4. Keep the GDD available as project context. If the agent starts adding features outside scope, point it back to the P0/P1 priorities.
5. Ask the agent to run the app and verify each stage in the browser. Do not accept “implemented” as proof that it works.

Antigravity's official documentation describes projects as the workspace boundary for agent activity and workspace rules as persistent instructions that shape agent behaviour. A bounded workspace and short, verifiable tasks are especially useful here.

## Persistent project rules

Copy this into workspace rules if you use them; otherwise paste it into the first agent prompt:

```text
PROJECT RULES — PROJECT ASHEN CROWN

1. Treat the attached GDD/build specification as the source of truth. Do not redesign the concept or expand scope without explaining why and asking before making a material change.
2. The real expense CSV workflow is P0. Do not substitute a fake progress bar, hard-coded transactions, or a simulated chore for real import, categorisation, review, and export.
3. Process CSV data only in the browser. Do not add a backend, analytics, external AI API, Supabase, authentication, or cloud storage for this MVP.
4. Never log raw transaction contents. Never upload the file. Never silently delete or exclude a transaction. Preserve original source columns/values in export.
5. Use transparent deterministic categorisation and conservative duplicate detection. Treat suggestions as fallible and allow manual corrections.
6. Keep story data, kingdom rules, and CSV processing separate. Put game stat changes in central game logic, not scattered UI event handlers.
7. Keep the app beginner-readable: TypeScript types, small components, sensible names, and comments only where they clarify non-obvious logic. Avoid unnecessary abstractions and dependencies.
8. Do not replace working project configuration or delete existing files without inspecting them first. Reuse the current stack if it already works.
9. After each stage, run relevant checks (dev server, tests, and/or production build), fix errors, and summarise changed files and remaining issues.
10. No fake buttons. Every visible primary action must work. Do not claim a feature is verified unless you actually ran it.
11. Prioritise correctness, clarity, and a complete demo flow over decorative animation or unrequested features.
12. Keep the fictional kingdom economy completely separate from the user's real financial data. Never use transaction amounts to calculate game resources or rewards.
```

---

# 10. Prompt 1 — inspect and plan before coding

Paste this first. The goal is to prevent the agent from blindly scaffolding over an existing project.

```text
We are building Project Ashen Crown, a 6–8 hour solo hackathon MVP. Read the complete GDD and technical specification provided in this conversation/project context before acting.

First inspect the current workspace:
- Identify the framework, package manager, existing files, scripts, and whether anything is already implemented.
- Check whether the project already runs and whether there are existing design or coding conventions.
- Do not delete, replace, or rewrite working configuration without a concrete reason.

Then give me:
1. A concise description of the current workspace state.
2. The smallest implementation plan that meets the P0 and P1 requirements.
3. Any dependency additions you recommend, with a reason for each.
4. The exact files you expect to create or modify.
5. The first milestone and how you will verify it.

Do not start implementing yet. Do not ask broad product-design questions; the product decisions are already in the specification. Ask only if a genuine blocker exists that cannot be resolved safely from the specification.
```

# 11. Prompt 2 — scaffold and visual foundation

Use after reviewing the plan.

```text
Implement Milestone 1 for Project Ashen Crown: a clean, runnable app shell and visual foundation.

Requirements:
- Reuse the existing project stack if it is already functional. If the workspace is empty, use Vite + React + TypeScript.
- Add Tailwind only if it can be integrated cleanly; otherwise use the existing styling approach.
- Create the shared app shell and the five screen states: Prologue, Council, Settlement, Steward's Ledger, and Chapter Ending.
- At this stage, navigation can use placeholder content, but every visible navigation/primary action must work.
- Establish the visual system from the specification: restrained ink/charcoal, parchment, muted bronze, strong readable typography, cinematic story panels, clean utility/table styles.
- Prioritise laptop layout and make the shell adapt to narrow screens.
- Do not add a backend, authentication, Supabase, external API, or stock image dependency.
- Do not spend time on elaborate artwork or animation.

After implementation:
1. Run the app and inspect it in the browser.
2. Run the production build.
3. Fix errors before reporting completion.
4. Summarise the files changed and any remaining placeholder areas.

Stop after this milestone. Do not implement the CSV processor or full game logic yet.
```

# 12. Prompt 3 — implement and verify the expense processor

This is the most important prompt. Prioritise it over story polish.

```text
Implement the complete P0 expense-organisation workflow for Project Ashen Crown. Follow the GDD's privacy and data-safety requirements exactly.

Build in this order:
A. CSV import
- Accept a local .csv file and include a small, clearly labelled fictional sample CSV option.
- Parse in the browser using Papa Parse or an already-installed reliable parser.
- Detect common Date, Description, Amount, Debit, Credit, and Category headers case-insensitively.
- Require a usable description plus either Amount or Debit/Credit. Date is optional.
- If mapping is ambiguous, show a small mapping UI instead of silently choosing the wrong columns.
- Handle quoted commas, empty rows, and common amount formatting.
- Preserve the original row values and every original column.

B. Normalisation and categorisation
- Create typed normalised transaction objects while retaining the original source row.
- Implement transparent deterministic keyword categorisation for the ten categories in the specification.
- Return high/medium/low confidence. Unmatched rows become Other / Needs Review with low confidence.
- Allow every category to be changed manually.

C. Duplicate review
- Conservatively flag exact potential duplicates using normalised date + amount + description. If no date is available, do not flag duplicates automatically.
- Never auto-delete or auto-exclude.
- Require an explicit Keep or Exclude from cleaned export decision for each flagged row.

D. Review UI
- Show counts and filters for All, Needs Review, Possible Duplicates, and Reviewed.
- Paginate at about 25 rows per page.
- Manual category changes and duplicate decisions must persist when changing filters or pages.
- Include helpful empty, error, and no-results states.

E. Export
- Download a new valid CSV, preserving original columns/values and appending the final category and review/duplicate annotations.
- Only omit rows that the user explicitly marked Exclude from cleaned export. Show the exclusion count before export.
- Never overwrite the uploaded file.

F. Privacy
- All parsing, categorisation, review, and export must happen locally in the browser.
- Do not add a server, API, cloud storage, analytics, or AI service.
- Do not log raw transaction content.
- Make the privacy note accurate to the actual implementation.

G. Testing
- Add tests for header detection, amount parsing, category rules, duplicate logic, and export escaping if test infrastructure is available.
- Test the sample file end to end.
- Test at least one CSV with quoted commas and one with debit/credit columns.
- Confirm the app can handle 5,000 rows with pagination without rendering every row at once.

Do not implement kingdom rewards yet. First make the ledger workflow work independently. Run the app, run tests, run the production build, fix errors, and report exactly what you verified versus what remains unverified.
```

# 13. Prompt 4 — implement the game logic and branching chapter

```text
Implement the P1 game logic for Project Ashen Crown, using the GDD as the source of truth.

Implement:
1. Initial kingdom stats and relationship values exactly as specified.
2. The two council choices and their specified stat/relationship effects.
3. The three building upgrades and their effects. A building can be upgraded only once.
4. Stewardship Seal state, with no more than three seals awarded from the three ledger milestones.
5. The readiness formula and three ending tiers exactly as specified.
6. A restart/reset action that returns the chapter to its initial state and clears the active ledger session.

Engineering requirements:
- Put all game rules, stat clamping, choice effects, building effects, and ending calculation in central typed functions/reducer logic.
- Do not scatter magic numbers across UI components.
- Prevent double-awarding seals if a milestone callback fires more than once.
- Make sure the same choice cannot be selected twice to farm stat increases. Either lock the choice after selection or make the transition idempotent.
- Clamp stats and relationships to 0–100.
- Make all three endings reachable in test states or reasonable gameplay combinations. Do not let one choice automatically determine the ending.
- Add unit tests for the formula, thresholds, clamping, choice effects, and one-time building upgrades.

Keep the UI simple for now. Run tests and a production build. Summarise the exact logic and any balancing concerns.
```

# 14. Prompt 5 — connect the game to the real chore and finish the chapter

```text
Integrate the working expense ledger with Project Ashen Crown's story and kingdom systems.

Requirements:
- Present the expense task in-world as The Steward's Ledger, while clearly stating that the user's personal expense CSV is processed locally and is not the fictional kingdom's account book.
- Award Seal 1 only after a valid CSV or the labelled sample file is loaded.
- Award Seal 2 only after the automatic categorisation pass completes successfully.
- Award Seal 3 only after review is complete, all possible duplicates have explicit Keep/Exclude decisions, and a reviewed CSV export has been triggered successfully.
- If there are no uncertain rows or duplicate candidates, allow the review milestone to complete through a clear confirmation step. Do not invent work.
- Each earned seal enables one building upgrade; the player chooses Granary, Watchtower, or Marketplace. A seal can be spent only once.
- Never use transaction count, amount, category, merchant, or personal spending behaviour to award resources or alter kingdom stats.
- Add story dialogue that reacts to the player's actual choices and the current state, without adding a large branching dialogue engine.
- Add the Northern Pass ending scene and explain which kingdom factors shaped the result.
- The sample CSV path must be labelled as demo data throughout; it should not be mistaken for real personal data.

Then play through the entire journey from the title screen. Verify that each milestone unlocks only once, the ledger really exports a CSV, every building can be upgraded at most once, and each ending can be reached. Fix any broken transitions. Run the production build.
```

# 15. Prompt 6 — visual polish, QA, and demo readiness

```text
Perform a focused final QA and polish pass on Project Ashen Crown. Do not add new features unless required to fix a defect.

First test the full primary flow:
Title → Council choice 1 → Council choice 2 → Settlement → load sample or upload CSV → categorise → review → duplicate decisions → export → building upgrades → Northern Pass ending.

Check:
- No dead buttons, broken navigation, console errors, or type/build errors.
- CSV import and export preserve source data and handle quoted values.
- User corrections survive sorting/filtering/pagination.
- Duplicate rows are never excluded without explicit user action.
- The privacy notice matches the actual data flow; no raw CSV is sent or logged.
- Seal rewards cannot be duplicated and do not depend on spending amounts.
- Reset clears the appropriate session state.
- All three endings work.
- Table readability, keyboard focus, labels, contrast, laptop and mobile layout.

Polish only the highest-impact visual problems: spacing, hierarchy, typography, consistency, clear status feedback, and subtle transitions. Do not sacrifice data-table usability for atmosphere.

Run tests and the production build. If browser testing is available, inspect at laptop and narrow mobile widths. Finish with:
1. What works and was verified.
2. Any known limitations.
3. Exact commands to run locally.
4. The simplest deployment steps for the existing setup.
5. A short 2–3 minute judge-demo script.
```

---

# 16. Two-minute judge demo script

Use a clean sample ledger for a predictable demonstration. State clearly that it is fictional sample data; then explain that users can upload their own CSV and the same local workflow applies.

1. **Hook (15 seconds):** “We all procrastinate on digital chores. Ashen Crown turns one of them—expense organisation—into progress in a story-driven kingdom game.”
2. **Story (25 seconds):** Show Harun's inheritance and the council choice. Explain that the province is divided and the northern army is approaching.
3. **Actual chore (60 seconds):** Open the Steward's Ledger, load the sample CSV, show automatic categorisation, correct one uncertain transaction, resolve a possible duplicate, and export the reviewed file. Emphasise that the file is processed in-browser and never becomes kingdom currency.
4. **Game payoff (30 seconds):** Show the Stewardship Seals unlocking settlement improvements. Upgrade a building, show the stat change, and trigger the Northern Pass outcome.
5. **Close (10 seconds):** “The game does not pretend to do the chore. Completing the real chore is what moves the story forward.”

---

# 17. What not to build in this hackathon

Do not spend MVP time on:
- Real-time combat, character movement, open-world exploration, pathfinding, or a large map.
- Multiple chapters, dozens of characters, or a large dialogue tree.
- User accounts, cloud sync, bank API integration, direct bank login, or automatic bank scraping.
- Supabase/database setup unless a hard requirement appears (none is currently identified).
- AI categorisation APIs, subscription products, or AI-generated financial advice.
- Elaborate sound design or animation before CSV import/review/export is reliable.

A small, finished, honest experience is stronger than a large prototype with a broken core feature.
