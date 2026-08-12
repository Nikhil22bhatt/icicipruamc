/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-category (Our Funds category cards).
 * Base block: cards.
 * Source: https://www.icicipruamc.com/ — .promotional-card-container
 * Content model: each row = one category card ->
 *   cell 1 = illustrated icon image; cell 2 = category label as a link.
 * 6 cards: Equity Funds, Hybrid Funds, Debt Funds, Solution Oriented Funds,
 *          Fund of Funds, Index Funds.
 *
 * The per-card icon in the source is an inline base64 data-URI SVG illustration.
 * Doc-based authoring cannot carry data-URI images (they are not portable authorable
 * assets), so the importer strips them and the image cell would render empty. The six
 * SVGs were therefore decoded into stable repo assets at /icons/funds/<key>.svg and
 * this parser emits an <img> pointing at the matching local icon (keyed off the card's
 * ?fund= destination). The whole card is a link (<a class="planner-card" href>), so the
 * label is emitted as an anchor carrying that href.
 * Generated: 2026-08-12
 */

// Map each category card's ?fund= key to its decoded local icon asset.
// Emit ORIGIN-RELATIVE paths so they resolve against the migrated site itself
// (local preview and the published EDS host) where these repo assets live under
// /icons/funds/. The import script's WebImporter.rules.adjustImageUrls() only
// rewrites protocol-relative/relative URLs that lack a leading slash; a root-relative
// "/icons/..." path is preserved as-is. The cards-category block JS special-cases
// these SVG icons so they are NOT piped through createOptimizedPicture (which would
// append ?format=webply and 404 on a plain static asset).
const ICON_BASE = '/icons/funds';
const FUND_ICONS = {
  EQUITY_FUNDS: `${ICON_BASE}/equity-funds.svg`,
  HYBRID_FUNDS: `${ICON_BASE}/hybrid-funds.svg`,
  DEBT_FUNDS: `${ICON_BASE}/debt-funds.svg`,
  SOLUTION_ORIENTED_FUNDS: `${ICON_BASE}/solution-oriented-funds.svg`,
  FUND_OF_FUNDS: `${ICON_BASE}/fund-of-funds.svg`,
  INDEX_FUNDS: `${ICON_BASE}/index-funds.svg`,
};

export default function parse(element, { document }) {
  const cells = [];

  // One card per list item / planner-card link.
  let items = Array.from(element.querySelectorAll(':scope > li, li'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll('a.planner-card'));
  }

  items.forEach((item) => {
    // The card anchor holds the destination href.
    const cardLink = item.matches('a.planner-card') ? item : item.querySelector('a.planner-card, a[href]');
    const href = cardLink ? cardLink.getAttribute('href') : null;

    // Cell 1: illustrated icon image. The source <img> is an inline data-URI SVG that
    // the doc importer drops, so substitute the decoded local asset matched by ?fund= key.
    let icon = null;
    const fundKey = href ? (href.match(/fund=([A-Z_]+)/) || [])[1] : null;
    const iconPath = fundKey ? FUND_ICONS[fundKey] : null;
    if (iconPath) {
      icon = document.createElement('img');
      icon.setAttribute('src', iconPath);
      const labelForAlt = item.querySelector('p');
      icon.setAttribute('alt', labelForAlt ? labelForAlt.textContent.replace(/\s+/g, ' ').trim() : '');
    } else {
      // Fallback: keep whatever image the source had (e.g. a hosted URL).
      icon = item.querySelector('.planner-card_graphic img, img');
    }

    // Cell 2: category label as a link.
    const labelEl = item.querySelector('p');
    let labelCell = '';
    const labelText = labelEl ? labelEl.textContent.replace(/\s+/g, ' ').trim() : (cardLink ? cardLink.textContent.replace(/\s+/g, ' ').trim() : '');
    if (labelText) {
      const a = document.createElement('a');
      if (href) a.setAttribute('href', href);
      a.textContent = labelText;
      labelCell = a;
    }

    if (icon || labelCell) {
      // 2-column row: [icon, label link]. Pad any missing cell.
      cells.push([icon || '', labelCell || '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
