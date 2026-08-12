/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-strip (iSIF promo strip).
 * Base block: columns.
 * Source: https://www.icicipruamc.com/ — .sif-banner.sif-banner-home
 * Content model: one row, 3 cells:
 *   cell 1 = rupee-coins icon image
 *   cell 2 = 'Introducing' + iSIF logo image + 'Our offering of Specialized Investment Funds'
 *   cell 3 = 'Learn More' link -> https://www.isif.icicipruamc.com
 *
 * The source element contains large inline base64 SVG decorations (firecrackers / stars).
 * Those are intentionally IGNORED — only the meaningful content is extracted.
 * Generated: 2026-08-12
 */
export default function parse(element, { document }) {
  // --- Cell 1: rupee icon (real raster image, not the decorative base64 SVGs) ---
  const iconImage = element.querySelector('img.rupee-image, .rupee-image-wrapper img.rupee-image');

  // --- Cell 2: title + iSIF logo + subtitle ---
  const title = element.querySelector('.banner-title');
  const logo = element.querySelector('img.banner-image, .banner-title-wrapper img');
  const subtitle = element.querySelector('.banner-subtitle');

  const contentCell = [];
  if (title && title.textContent.trim()) contentCell.push(title);
  if (logo) contentCell.push(logo);
  if (subtitle && subtitle.textContent.trim()) contentCell.push(subtitle);

  // --- Cell 3: CTA link. Rebuild as a clean anchor to drop the decorative arrow
  // icon + MUI ripple span nested inside the source button. ---
  const ctaSource = element.querySelector('a.banner-button-link, .banner-button-wrapper a[href]');
  let ctaCell = '';
  if (ctaSource) {
    const href = ctaSource.getAttribute('href');
    // Label from the button text (strip nested icon markup).
    const label = (ctaSource.textContent || '').trim() || 'Learn More';
    const a = document.createElement('a');
    if (href) a.setAttribute('href', href);
    a.textContent = label;
    ctaCell = a;
  }

  // Empty-block guard: bail if the strip carries no meaningful content.
  if (!iconImage && !contentCell.length && !ctaCell) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row, 3 columns. Pad any missing cell with '' to keep column count even.
  const cells = [
    [iconImage || '', contentCell.length ? contentCell : '', ctaCell || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-strip', cells });
  element.replaceWith(block);
}
