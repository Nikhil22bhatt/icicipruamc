import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Group the footer's link columns into wrappers.
 * The link section arrives as a flat run of <h2>/<ul> pairs inside a single
 * content wrapper (EDS merges consecutive default content). Wrap each
 * <h2> + following <ul> into a .footer-col so the CSS grid can lay them out as
 * distinct columns instead of one stacked block.
 * @param {Element} footer The footer container element
 */
function groupLinkColumns(footer) {
  const headings = [...footer.querySelectorAll('h2')];
  if (headings.length < 2) return;

  const wrapper = headings[0].parentElement;
  // Only group when the headings share one flat wrapper (the flattened case).
  if (!headings.every((h) => h.parentElement === wrapper)) return;

  wrapper.classList.add('footer-columns');
  headings.forEach((h) => {
    const col = document.createElement('div');
    col.className = 'footer-col';
    const list = h.nextElementSibling;
    wrapper.insertBefore(col, h);
    col.append(h);
    if (list && list.tagName === 'UL') col.append(list);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  groupLinkColumns(footer);

  block.append(footer);
}
