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

// Branded fallback shown when a source video thumbnail is unavailable. Some source
// thumbnails were already broken placeholders at scrape time (the videos are private
// / embedding-disabled, so YouTube generates no public thumbnail in any variant).
const VIDEO_FALLBACK = 'https://main--icicipruamc--nikhil22bhatt.aem.page/icons/funds/video-fallback.svg';

/**
 * Swap a thumbnail that fails to load for the branded fallback image, so every
 * video card looks intentional instead of rendering a broken-image icon.
 * Guarded against loops in case the fallback itself is unreachable.
 * @param {HTMLImageElement} img
 */
function handleMissingThumb(img) {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) {
      const imageCell = img.closest('.cards-video-card-image');
      if (imageCell) imageCell.classList.add('cards-video-thumb-missing');
      img.remove();
      return;
    }
    img.dataset.fallbackApplied = 'true';
    // Drop any <source> siblings so the fallback <img src> is what renders.
    const picture = img.closest('picture');
    if (picture) picture.querySelectorAll('source').forEach((s) => s.remove());
    img.src = VIDEO_FALLBACK;
  });
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
