/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-video (Knowledge Centre video cards).
 * Base block: cards.
 * Source: https://www.icicipruamc.com/ — #kc-tabpanel
 * Content model: each row = one video card -> cell 1 = thumbnail image; cell 2 = title (link to video) + duration text.
 *
 * Faithful static reproduction of a slick carousel of video cards. Each .file-card
 * becomes a 2-column card row. Excluded as non-authorable chrome: the decorative
 * play-icon overlay (.playIcon / .video-info), the per-card "share" button, the
 * ".sr-only" slide counter, and ".slick-dots" pagination — none carry static
 * content. The title link and duration are kept.
 * Generated: 2026-08-12
 */
export default function parse(element, { document }) {
  const cells = [];

  // One card per video tile.
  const cards = Array.from(element.querySelectorAll('.file-card'));

  cards.forEach((card) => {
    // Thumbnail: the main tile image, not the play-icon overlay inside .video-info.
    const thumb = card.querySelector('.thumb > img, .thumb img.w-100, .thumb img:not(.playIcon img)')
      || card.querySelector('.thumb img');

    // Title link (to the video).
    const titleLink = card.querySelector('a.file-card__title-link, .file-card__info__heading a, h3 a');
    // Duration text.
    const duration = card.querySelector('.duration');

    const contentCell = [];
    if (titleLink) {
      // Rebuild the heading as an anchor so the title stays a link in cell 2.
      const href = titleLink.getAttribute('href');
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      if (href) a.setAttribute('href', href);
      a.textContent = titleLink.textContent.trim();
      h3.appendChild(a);
      contentCell.push(h3);
    }
    if (duration && duration.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = duration.textContent.trim();
      contentCell.push(p);
    }

    if (thumb || contentCell.length) {
      // 2-column row: [thumbnail, title link + duration]. Pad a missing cell.
      cells.push([thumb || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
