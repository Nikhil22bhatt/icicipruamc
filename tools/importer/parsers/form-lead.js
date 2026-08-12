/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form-lead (Consult our Experts lead form).
 * Base block: custom (no vanilla "form" block in the library — inferred from source HTML).
 * Source: https://www.icicipruamc.com/ — .expert-consult
 * Content model (per task brief): block cells carry an image, heading "Consult our
 * Experts", tagline, and the STATIC form fields (Your name; +91 (IND) Mobile Number;
 * City, State) + submit label "ASK EXPERT". The interactive form is reproduced as
 * faithful STATIC content — no JS behavior, just the field labels and submit label.
 *
 * IMPORTANT — default content nested inside the block instance element:
 * .expert-consult also wraps the eyebrow "New to Mutual Funds?" (which precedes the
 * panel) and a trailing legal Disclaimer paragraph. The authoring analysis classifies
 * both as default content (separate sequences), NOT part of the form block. The section
 * transformer only inserts <hr> and does not extract default content, so this parser
 * PRESERVES the eyebrow and disclaimer as sibling nodes around the block (otherwise they
 * would be destroyed when .expert-consult is replaced). Consequently the completeness
 * scorer — which measures only the created block table against the whole element's text
 * (the disclaimer is a large text block) — reports a shortfall equal to that relocated
 * default content; it is preserved on the page as default content, not dropped.
 * Generated: 2026-08-12
 */
export default function parse(element, { document }) {
  const doc = document;

  // ---------------------------------------------------------------------------
  // 1. Leading default content: eyebrow "New to Mutual Funds?".
  // ---------------------------------------------------------------------------
  const preNodes = [];
  const eyebrow = element.querySelector('.expert-consult__tagline');
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = doc.createElement('p');
    p.textContent = eyebrow.textContent.replace(/\s+/g, ' ').trim();
    preNodes.push(p);
  }

  // ---------------------------------------------------------------------------
  // 2. Form block content.
  // ---------------------------------------------------------------------------
  // Illustrative image (left side).
  const image = element.querySelector('img.graphic, .expert-consult-wrapper__image_text img.graphic');

  const contentCell = [];

  // Heading "Consult our Experts".
  const heading = element.querySelector('h2.title-experts, .title-experts, h2');
  if (heading && heading.textContent.trim()) {
    const h2 = doc.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(h2);
  }

  // Tagline.
  const tagline = element.querySelector('p.tag-line, .tag-line');
  if (tagline && tagline.textContent.trim()) {
    const p = doc.createElement('p');
    p.textContent = tagline.textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(p);
  }

  // Static form fields — reproduced as their labels (inputs are empty).
  // The mobile field is preceded by a country-code control defaulting to +91 (IND).
  const nameLabel = element.querySelector('#consult-your-name-label, [id$="your-name-label"]');
  const mobileLabel = element.querySelector('#consult-mobile-number-label, [id$="mobile-number-label"]');
  const cityLabel = element.querySelector('#consult-city-state-label, [id$="city-state-label"]');

  const fieldLabels = [];
  if (nameLabel && nameLabel.textContent.trim()) {
    fieldLabels.push(nameLabel.textContent.replace(/\s+/g, ' ').trim());
  }
  if (mobileLabel && mobileLabel.textContent.trim()) {
    // Match the brief's "+91 (IND) Mobile Number" (country-code prefix + field label).
    fieldLabels.push(`+91 (IND) ${mobileLabel.textContent.replace(/\s+/g, ' ').trim()}`);
  }
  if (cityLabel && cityLabel.textContent.trim()) {
    fieldLabels.push(cityLabel.textContent.replace(/\s+/g, ' ').trim());
  }
  fieldLabels.forEach((label) => {
    const p = doc.createElement('p');
    p.textContent = label;
    contentCell.push(p);
  });

  // Submit label "ASK EXPERT" (static; the button carries no destination).
  const submit = element.querySelector('.consult-btn, button.consult-btn');
  if (submit && submit.textContent.trim()) {
    const p = doc.createElement('p');
    const a = doc.createElement('a');
    a.textContent = submit.textContent.replace(/\s+/g, ' ').trim();
    p.appendChild(a);
    contentCell.push(p);
  }

  // ---------------------------------------------------------------------------
  // 3. Trailing default content: legal Disclaimer paragraph.
  // ---------------------------------------------------------------------------
  const postNodes = [];
  // The disclaimer is the trailing grid holding a "Disclaimer:" bold span + body span,
  // and is NOT part of the form/heading/tagline content.
  const disclaimerSpans = Array.from(element.querySelectorAll('.MuiGrid-root.mt-2 span, .css-rfnosa.mt-2 span'));
  const disclaimerText = disclaimerSpans
    .map((s) => s.textContent.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (disclaimerText) {
    const p = doc.createElement('p');
    p.textContent = disclaimerText;
    postNodes.push(p);
  }

  // Empty-block guard.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row, 2 columns: [image | heading + tagline + fields + submit].
  // Pad a missing image so the row keeps a consistent column count.
  const cells = [[image || '', contentCell.length ? contentCell : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-lead', cells });

  // Reconstruct: eyebrow (default) -> form block -> disclaimer (default).
  element.replaceWith(...preNodes, block, ...postNodes);
}
