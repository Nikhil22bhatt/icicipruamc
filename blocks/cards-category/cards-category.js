import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when the EDS image optimizer can serve this source.
 * The optimizer only works for same-origin raster media; SVGs and cross-origin
 * assets must be left as plain <img> (optimizing them yields 404s or nonsensical
 * ?format=svg|webply renditions).
 * @param {string} src image URL
 */
function canOptimize(src) {
  try {
    const url = new URL(src, window.location.href);
    if (url.pathname.toLowerCase().endsWith('.svg')) return false;
    return url.origin === window.location.origin;
  } catch (e) {
    return false;
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-category-card-image';
      else div.className = 'cards-category-card-body';
    });
    ul.append(li);
  });
  // The category icons are bundled assets that live at /icons/funds/ on THIS site.
  // The importer's adjustImageUrls rule rewrites relative paths to the source origin
  // (icicipruamc.com), which 404s — so re-point any /icons/funds/ src back to the
  // current origin before rendering.
  ul.querySelectorAll('picture > img, img').forEach((img) => {
    const iconMatch = img.src.match(/\/icons\/funds\/[^/?#]+\.svg$/);
    if (iconMatch) {
      [img.src] = iconMatch;
      const source = img.closest('picture')?.querySelector('source');
      if (source) source.remove();
    }
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (canOptimize(img.src)) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    }
  });
  block.replaceChildren(ul);
}
