import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * True when the EDS image optimizer can serve this source.
 * Only same-origin raster media optimizes cleanly; SVGs and cross-origin assets
 * (YouTube thumbnails are cross-origin) are left as plain <img>.
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

/**
 * Some source video thumbnails (unavailable/removed YouTube videos) 404 at origin.
 * Rather than render a broken-image icon, mark the card so CSS shows a neutral
 * placeholder tile behind the play affordance.
 * @param {HTMLImageElement} img
 */
function handleMissingThumb(img) {
  img.addEventListener('error', () => {
    const imageCell = img.closest('.cards-video-card-image');
    if (imageCell) imageCell.classList.add('cards-video-thumb-missing');
    img.remove();
  }, { once: true });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-video-card-image';
      else div.className = 'cards-video-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    let target = img;
    if (canOptimize(img.src)) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimized);
      target = optimized.querySelector('img');
    }
    if (target) handleMissingThumb(target);
  });
  block.replaceChildren(ul);
}
