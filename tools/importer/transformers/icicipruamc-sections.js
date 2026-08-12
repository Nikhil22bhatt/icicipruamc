/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for ICICI Prudential AMC (icicipruamc).
 *
 * Inserts section breaks (<hr>) between the top-level content sections defined in
 * the template so the imported document renders one `---` divider per boundary.
 * Optionally emits a "Section Metadata" block for any section that declares a
 * `style` (none do on the homepage — all section styles are null — so no metadata
 * blocks are produced here; the logic is retained for reuse across templates).
 *
 * Runs in afterTransform ONLY: block parsers run between the two hooks and some
 * section selectors ARE the block instance (e.g. the iSIF strip / columns-strip),
 * so they only resolve cleanly relative to their surviving top-level container.
 *
 * Section selectors are sourced from tools/importer/page-templates.json, each
 * validated against migration-work/cleaned.html. The 7 sections map 1:1 to the
 * direct children of `#root > div.App > div.root-home` in document order:
 *   1 hero, 2 iSIF strip, 3 quick-links, 4 knowledge, 5 recommended,
 *   6 our-funds, 7 consult-experts.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Walk up from a matched section element to the direct child of `div.root-home`
 * that contains it. This normalizes section boundaries to the top content level
 * so the inserted <hr> renders as a clean top-level section break in markdown.
 * Falls back to the matched element itself if the root-home wrapper is not an
 * ancestor (defensive; should not happen on this site).
 */
function resolveTopLevelContainer(matched, rootHome) {
  if (!matched) return null;
  if (!rootHome) return matched;
  let node = matched;
  while (node && node.parentElement && node.parentElement !== rootHome) {
    node = node.parentElement;
    // Guard against walking above root-home (e.g. out to <body>).
    if (node === rootHome || node.tagName === 'BODY' || node.tagName === 'HTML') {
      break;
    }
  }
  // node is now the direct child of rootHome (or the matched element if the walk
  // could not reach root-home).
  return node && node.parentElement === rootHome ? node : matched;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload
    && payload.template
    && Array.isArray(payload.template.sections)
    ? payload.template.sections
    : [];
  if (sections.length < 2) return;

  const doc = (payload && payload.document) || (element && element.ownerDocument);
  if (!doc) return;

  // Top-level content wrapper on this site. Present in both validator context
  // (raw live DOM) and real-import context (parsers only replace descendants).
  const rootHome = element.querySelector('.root-home') || element;

  // Resolve each section to its distinct top-level container, preserving order.
  const resolved = sections.map((section) => {
    let matched = null;
    if (section && section.selector) {
      try {
        matched = element.querySelector(section.selector);
      } catch (e) {
        matched = null;
      }
    }
    return {
      section,
      container: resolveTopLevelContainer(matched, rootHome),
    };
  });

  // Insert in reverse document order so earlier insertions do not shift the
  // reference nodes of later ones. Skip the first section (no leading break)
  // and any section whose selector did not resolve.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, container } = resolved[i];
    if (!container) continue;

    // Section Metadata block (only when a style is declared). Dormant on the
    // homepage since every section.style is null; retained for template reuse.
    if (section && section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      container.appendChild(metadataBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      container.parentElement.insertBefore(hr, container);
    }
  }
}
