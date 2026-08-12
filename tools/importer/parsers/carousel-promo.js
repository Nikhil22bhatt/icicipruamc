/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-promo (hero promo banner carousel).
 * Base block: carousel.
 * Source: https://www.icicipruamc.com/ — .promotional-bannerv2
 * Content model: each row = one slide -> cell 1 = slide image; cell 2 = heading + subheading + up to two CTA links.
 *
 * Faithful static reproduction of an interactive slideshow: each slide becomes a
 * stacked row, no JS behavior. Slick infinite-loop CLONE slides (.slick-cloned) are
 * removed upstream by the site cleanup transformer (icicipruamc-cleanup.js,
 * beforeTransform) so this parser sees only the 4 real slides. It processes every
 * remaining .slick-slide it is given (division of labor: transformer de-duplicates,
 * parser extracts).
 * Generated: 2026-08-12
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each slide is a .slick-slide (clones already stripped by the cleanup transformer).
  let slides = Array.from(element.querySelectorAll('.slick-slide'));
  // Fallback for DOM variation (e.g. if slick markup was simplified/de-slicked).
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.promotional-container, .banner-container'));
  }

  slides.forEach((slide) => {
    // Slide image lives in the right-hand content wrapper.
    const image = slide.querySelector('.banner-img-wrapper img, .banner-right-content img, img');

    // Heading + subheading from the left-hand content.
    const heading = slide.querySelector('h1, h2, h3, .promotional-banner-heading, [class*="banner-heading"]');
    const description = slide.querySelector('p, .promotional-banner-description, [class*="banner-description"]');

    // CTAs are <button> elements without hrefs; reproduce their labels as static CTA links.
    const ctaButtons = Array.from(slide.querySelectorAll('.banner-button-wrapper button, .banner-left-content button'));

    const contentCell = [];
    if (heading && heading.textContent.trim()) contentCell.push(heading);
    if (description && description.textContent.trim()) contentCell.push(description);
    ctaButtons.forEach((btn) => {
      const label = btn.textContent.trim();
      if (!label) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.textContent = label;
      p.appendChild(a);
      contentCell.push(p);
    });

    // Only emit a slide row if it carries an image or textual content.
    if (image || contentCell.length) {
      // 2-column row: [image, content]. Pad a missing image with an empty cell.
      cells.push([image || '', contentCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-promo', cells });
  element.replaceWith(block);
}
