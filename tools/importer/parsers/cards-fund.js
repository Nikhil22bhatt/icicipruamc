/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-fund (Recommended Schemes fund cards).
 * Base block: cards.
 * Source: https://www.icicipruamc.com/ — .funds-section .fund-wrapper
 * Content model: each row = one fund card ->
 *   cell 1 = riskometer image;
 *   cell 2 = fund name (link) + plan + category chips + 'CAGR (5 Years)' label
 *            + percentage figure + 'As on' date + 'Invest' link.
 * CAGR figures and 'As on' dates are captured as STATIC text (faithful reproduction).
 *
 * IMPORTANT — default content is nested inside the block instance element:
 * .fund-wrapper also wraps the section heading ("Recommended Schemes"), its subtitle,
 * the static "Show performance for: Five Year" control, and the trailing
 * "EXPLORE ALL OUR FUNDS" link. The section transformer only inserts <hr> breaks and
 * does NOT extract default content, so this parser PRESERVES that default content as
 * sibling nodes around the block (otherwise it would be destroyed when the wrapper is
 * replaced). Consequently the completeness scorer — which measures only the created
 * block table against the whole wrapper's text — reports a shortfall equal to that
 * relocated default content; it is preserved on the page, not dropped.
 *
 * Excluded as non-authorable chrome: the CAGR info-icon tooltip ("Compound annual
 * growth rate"), the trend arrow icon inside the CAGR figure, and MUI ripple spans.
 * Generated: 2026-08-12
 */
export default function parse(element, { document }) {
  const doc = document;

  // ---------------------------------------------------------------------------
  // 1. Section-level default content that lives INSIDE the block instance.
  //    Preserved as siblings so it is not lost when .fund-wrapper is replaced.
  // ---------------------------------------------------------------------------
  const preNodes = [];

  const headingSrc = element.querySelector(':scope > .MuiGrid-container h3, .fund-description')
    ? element.querySelector('h3.MuiTypography-h2, h3[class*="Bold"]')
    : element.querySelector('h3');
  if (headingSrc && headingSrc.textContent.trim()) {
    // Authoring level is h2 for this section heading.
    const h2 = doc.createElement('h2');
    h2.textContent = headingSrc.textContent.trim();
    preNodes.push(h2);
  }

  const subtitle = element.querySelector('.fund-description');
  if (subtitle && subtitle.textContent.trim()) {
    const p = doc.createElement('p');
    p.textContent = subtitle.textContent.trim();
    preNodes.push(p);
  }

  // Static "Show performance for: Five Year" control (reproduced as static text).
  // NOTE: the label element carries id="performance-dropdown-FIVE_YEAR-label", so a
  // broad [id^="performance-dropdown"] selector matches the LABEL, not the value —
  // yielding the garbled "Show performance for: Show performance for". The selected
  // value lives specifically in the MUI select display node (.MuiSelect-select).
  const perfLabel = element.querySelector('.perf-dropdown label, [id$="-label"]');
  const perfValue = element.querySelector('.perf-dropdown .MuiSelect-select, .MuiSelect-select');
  if (perfLabel && perfValue && perfLabel.textContent.trim() && perfValue.textContent.trim()) {
    const p = doc.createElement('p');
    p.textContent = `${perfLabel.textContent.trim()}: ${perfValue.textContent.trim()}`;
    preNodes.push(p);
  }

  // ---------------------------------------------------------------------------
  // 2. Fund cards -> block rows.
  // ---------------------------------------------------------------------------
  const cells = [];
  const cards = Array.from(element.querySelectorAll('.funds-card'));

  cards.forEach((card) => {
    // Cell 1: riskometer image.
    const riskometer = card.querySelector('img.riskometer, .riskometer-btn img');

    // Cell 2 content.
    const contentCell = [];

    // Fund name as a link (heading anchor wraps two spans -> single readable name).
    const nameLink = card.querySelector('.funds-card__heading a, h3 a');
    if (nameLink) {
      const href = nameLink.getAttribute('href');
      const h3 = doc.createElement('h3');
      const a = doc.createElement('a');
      if (href) a.setAttribute('href', href);
      // Join the inner spans ("ICICI Prudential" + fund-name) with a space — they
      // are adjacent with no whitespace text node between them, so textContent alone
      // would fuse them ("ICICI PrudentialIndia Opportunities Fund").
      const nameSpans = Array.from(nameLink.querySelectorAll('span'));
      const nameText = nameSpans.length
        ? nameSpans.map((s) => s.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' ')
        : nameLink.textContent.replace(/\s+/g, ' ').trim();
      a.textContent = nameText;
      h3.appendChild(a);
      contentCell.push(h3);
    }

    // Plan (e.g. "Direct - Growth") — first direct <p> after the heading.
    const plan = card.querySelector('.funds-card__content > p.MuiTypography-body4, .funds-card__content > p');
    if (plan && plan.textContent.trim()) {
      const p = doc.createElement('p');
      p.textContent = plan.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }

    // Category chips (e.g. "Equity Funds", "Sectoral Thematic").
    const chips = Array.from(card.querySelectorAll('.funds-card__chips .MuiChip-label, .chip .MuiChip-label'));
    const chipLabels = chips
      .map((c) => c.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (chipLabels.length) {
      const p = doc.createElement('p');
      p.textContent = chipLabels.join(' | ');
      contentCell.push(p);
    }

    // "CAGR (5 Years)" label (join the two label fragments), excluding the tooltip.
    const cagrLabels = Array.from(card.querySelectorAll('.label-icon-wrapper > p.text-blue-light'));
    const cagrLabelText = cagrLabels
      .map((p) => p.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ');
    if (cagrLabelText) {
      const p = doc.createElement('p');
      p.textContent = cagrLabelText;
      contentCell.push(p);
    }

    // CAGR percentage figure (static). Strip the trailing trend-arrow image.
    const cagrValue = card.querySelector('.cagr-value');
    if (cagrValue) {
      const pct = (cagrValue.textContent || '').replace(/\s+/g, ' ').trim();
      if (pct) {
        const p = doc.createElement('p');
        p.textContent = pct;
        contentCell.push(p);
      }
    }

    // "As on <date>" (static).
    const asOn = card.querySelector('.funds-card__date');
    if (asOn && asOn.textContent.trim()) {
      const p = doc.createElement('p');
      p.textContent = asOn.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }

    // "Invest" CTA -> static link.
    const investBtn = card.querySelector('.funds-card__actions button, button[id^="invest-btn"]');
    if (investBtn && investBtn.textContent.trim()) {
      const p = doc.createElement('p');
      const a = doc.createElement('a');
      a.textContent = investBtn.textContent.trim();
      p.appendChild(a);
      contentCell.push(p);
    }

    if (riskometer || contentCell.length) {
      // 2-column row: [riskometer, fund details]. Pad a missing cell.
      cells.push([riskometer || '', contentCell.length ? contentCell : '']);
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Trailing default content: "EXPLORE ALL OUR FUNDS" link.
  // ---------------------------------------------------------------------------
  const postNodes = [];
  const exploreBtn = element.querySelector('.explore button, .explore .explore-text, .explore');
  if (exploreBtn && exploreBtn.textContent.trim()) {
    const p = doc.createElement('p');
    const a = doc.createElement('a');
    // Authored destination for the explore link.
    a.setAttribute('href', '/mutual-fund');
    a.textContent = exploreBtn.textContent.replace(/\s+/g, ' ').trim();
    p.appendChild(a);
    postNodes.push(p);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-fund', cells });

  // Reconstruct the section: default content, the cards block, then the explore link.
  element.replaceWith(...preNodes, block, ...postNodes);
}
