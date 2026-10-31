# Project Ashen Crown — Workspace Agent Rules

1. Treat `Project_Ashen_Crown_Build_Pack.md` as the source of truth. Do not redesign the concept or expand scope without explaining why and asking before making a material change.
2. The real expense CSV workflow is P0. Do not substitute a fake progress bar, hard-coded transactions, or a simulated chore for real import, categorisation, review, and export.
3. Process CSV data only in the browser. Do not add a backend, analytics, external AI API, Supabase, authentication, or cloud storage for this MVP.
4. Never log raw transaction contents. Never upload the file. Never silently delete or exclude a transaction. Preserve original source columns and values in the export.
5. Use transparent deterministic categorisation and conservative duplicate detection. Treat suggestions as fallible and allow manual corrections.
6. Keep story data, kingdom rules, and CSV processing separate. Put game stat changes in central game logic, not scattered UI event handlers.
7. Keep the app beginner-readable: TypeScript types, small components, sensible names, and comments only where they clarify non-obvious logic. Avoid unnecessary abstractions and dependencies.
8. Do not replace working project configuration or delete existing files without inspecting them first. Reuse the current stack if it already works.
9. After each stage, run relevant checks (dev server, tests, and/or production build), fix errors, and summarise changed files and remaining issues.
10. No fake buttons. Every visible primary action must work. Do not claim a feature is verified unless you actually ran it.
11. Prioritise correctness, clarity, and a complete demo flow over decorative animation or unrequested features.
12. Keep the fictional kingdom economy completely separate from the user's real financial data. Never use transaction amounts to calculate game resources or rewards.
