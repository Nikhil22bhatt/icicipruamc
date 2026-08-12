I have a clear picture of the project setup. This is a fresh AEM Edge Delivery boilerplate wired to the `icicipruamc` site (preview org `nikhil22bhatt`), with only the default boilerplate content in place. Before I finalize the migration plan, let me confirm a couple of scope decisions.# ICICI Prudential AMC Homepage Migration Plan

## Objective

Migrate the homepage at `https://www.icicipruamc.com/` into this AEM Edge Delivery Services project, including the **main body content, the top navigation (with Funds / Resources / Services mega-menus), and the full footer**. Interactive elements are reproduced as **faithful static authored content** (carousels as stacked slides, videos as thumbnail links, the lead-capture form as simple markup, fund figures captured as static text).

## Source Page Overview (from provided screenshots)

The homepage is composed of these top-to-bottom sections:

1. **Header / Navigation** — ICICI Prudential logo, nav links (Funds ▾, Resources ▾, Services ▾, Shareholders' Centre), AI search icon, Investor selector, Sign In button, hamburger.
2. **Hero carousel** — orange promo banner ("Investments now available through GIFT City") with "Learn More" CTA, GIFT City image, and slide dots (4 slides).
3. **Promo strip** — "Introducing iSIF — Our offering of Specialized Investment Funds" with a "Learn More" CTA.
4. **Quick Links** — 5 icon cards (Investor Services, Modify KYC, Branch Locator, Calculators, Downloads) in a carousel.
5. **Knowledge Centre** — Videos / Blogs tab toggle + 3 video cards (thumbnail, title, duration, Share) + "Explore All" link.
6. **Recommended Schemes** — "Show performance for" selector + 3 fund cards (fund name, tags, CAGR %, "As on" date, Invest button) + "Explore all our funds" link.
7. **Our Funds** — "Whatever your needs, we have it all" text + Explore CTA + 6 fund-category icon cards (Equity, Hybrid, Debt, Solution Oriented, Fund of Funds, Index).
8. **Consult our Experts** (New to Mutual Funds?) — image + lead-capture form (name, mobile, city/state, Ask Expert) + disclaimer.
9. **Footer** — 6 link columns (Resources, Funds, Tools, Services, Support, Other Links), app-download panel (Google Play / App Store / Share Link), WhatsApp Support block.
10. Sticky "i-Invest iPru" app-download banner (bottom; treated as decoration, not migrated as a core section).

## Current Project State

- Fresh AEM boilerplate wired to site `icicipruamc` (preview org `nikhil22bhatt`).
- Existing blocks: `cards`, `columns`, `hero`, `header`, `footer`, `fragment`, `widget`.
- `content/` holds only the default boilerplate `index.plain.html`, `nav.plain.html`, `footer.plain.html`.
- No import infrastructure (`tools/importer/…`) or `page-templates.json` yet.

> **Note:** Execution requires **Execute mode** — this plan cannot modify files or run the import while plan mode is active. Approve the plan to proceed.

## Approach

Use the project's structured migration flow: analyze the page → model sections into blocks (reusing boilerplate blocks and adding variants where needed) → build import infrastructure (parsers/transformers/page template) → run the bundled bulk-import script to generate the content HTML (never hand-write content files) → migrate design/styling → instrument nav and footer → validate visually against the original in the preview.

## Checklist

### Phase 1 — Setup & Analysis
- [ ] Confirm project type/config (doc vs da vs xwalk) and the block-library endpoint for this project.
- [ ] Scrape `https://www.icicipruamc.com/` — capture cleaned HTML, metadata, and download images/icons.
- [ ] Analyze page structure: identify the 9 core sections and the content sequences within each.
- [ ] Survey available blocks; map each section/sequence to a block (reuse `hero`, `cards`, `columns`; identify where new variants are needed).

### Phase 2 — Block Modeling & Variants
- [ ] Define block variants and content models for: hero carousel, promo strip, quick-links cards, knowledge-centre tabbed cards, recommended-scheme cards, our-funds category cards, consult-experts form.
- [ ] Register new block variants and record mappings in `page-templates.json` / block metadata.
- [ ] Create CSS/JS for any new blocks or variants (self-contained, scoped, mobile-first per project standards).

### Phase 3 — Import Infrastructure
- [ ] Generate block parsers for each block variant (`tools/importer/parsers/`).
- [ ] Generate page transformers (cleanup, section split, image/Scene7 handling) (`tools/importer/transformers/`).
- [ ] Assemble the import script combining page template + parsers + transformers.

### Phase 4 — Content Import (scripted, not hand-authored)
- [ ] Bundle the import script and run the bulk-import for the homepage URL.
- [ ] Verify the generated `index` content file is produced in the content directory with all sections and images referenced correctly.

### Phase 5 — Navigation & Footer
- [ ] Migrate the header/navigation, including the Funds / Resources / Services mega-menus and the Investor / Sign In elements (faithful static structure).
- [ ] Migrate the footer: 6 link columns, app-download panel, and WhatsApp Support block.

### Phase 6 — Design & Styling
- [ ] Extract design tokens (ICICI orange/navy palette, fonts, spacing) and apply site-level styles.
- [ ] Style each migrated block to match the original's computed styles (cards, hero, tabs, form, footer).

### Phase 7 — Validation
- [ ] Preview the migrated homepage locally and inspect DOM/structure (snapshot + evaluate).
- [ ] Visually critique the full page against the original screenshots; iterate on section- and block-level differences.
- [ ] Run `npm run lint` (and `lint:fix`) to ensure JS/CSS pass project linting.
- [ ] Confirm accessibility basics (heading hierarchy, alt text, ARIA on interactive-looking elements).

### Phase 8 — Wrap-up
- [ ] Summarize what was migrated, any content approximated as static (fund CAGR figures, form, carousels), and note follow-ups (e.g., wiring live data or interactivity later).

## Notes & Assumptions

- **Static fidelity:** Fund performance figures ("20.35%", "As on 11-Aug-2026") and the consult form are captured as static content; they are not wired to live data or submission back-ends in this pass.
- **Content is script-generated only:** All content HTML is produced via the bundled import script; content files will not be edited by hand.
- **Dynamic decorations** (sticky app banner, AI search) are treated as non-core and either omitted or represented as simple static elements, to be confirmed during analysis.
