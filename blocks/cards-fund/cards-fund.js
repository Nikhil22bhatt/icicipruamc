import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when the EDS image optimizer can serve this source.
 * The optimizer only works for same-origin raster media; SVGs and cross-origin
 * assets (e.g. the source-hosted riskometer PNGs) must be left as plain <img> so
 * they are not rewritten into ?format=webply renditions the remote host can't serve.
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
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-fund-card-image';
      else div.className = 'cards-fund-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (canOptimize(img.src)) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    }
  });
  block.replaceChildren(ul);
}
