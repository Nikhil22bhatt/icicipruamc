import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Faithful STATIC reproduction of the "Consult our Experts" lead form.
 *
 * Authored structure (as produced by the importer):
 *   A single row with two cells —
 *     cell 1: the illustrative expert image
 *     cell 2: a heading ("Consult our Experts"), a tagline paragraph, then one
 *             paragraph per form field, and finally a paragraph whose only child
 *             is an <a> carrying the submit label ("ASK EXPERT").
 *
 * Field paragraphs are plain text. A field is rendered as a labelled text input;
 * a leading country-code token like "+91 (IND)" is split off as an inline prefix.
 * The form is inert (no submission handler) — it exists to visually match source.
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
  // Locate the image (media panel) and the content cell (everything else).
  const img = block.querySelector('img');
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const contentCell = heading ? heading.parentElement : block;

  // Submit label: the trailing anchor ("ASK EXPERT").
  const submitLink = contentCell.querySelector('a');
  const submitLabel = (submitLink?.textContent || 'Submit').trim();
  const submitPara = submitLink ? submitLink.closest('p') : null;

  // Paragraphs in document order: [tagline, ...fields], excluding the submit para.
  const paras = [...contentCell.querySelectorAll('p')].filter((p) => p !== submitPara);
  const tagline = paras.length ? paras[0] : null;
  const fieldParas = paras.slice(1);

  // --- Build media panel ---
  const media = document.createElement('div');
  media.className = 'form-lead-media';
  if (img) {
    if (canOptimize(img.src)) {
      media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    } else if (picture) {
      media.append(picture);
    } else {
      media.append(img);
    }
  }

  // --- Build form panel ---
  const panel = document.createElement('div');
  panel.className = 'form-lead-panel';

  if (heading) {
    heading.classList.add('form-lead-title');
    panel.append(heading);
  }
  if (tagline) {
    tagline.classList.add('form-lead-tagline');
    panel.append(tagline);
  }

  const form = document.createElement('form');
  form.className = 'form-lead-form';
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (e) => e.preventDefault());

  fieldParas.forEach((p, i) => {
    const raw = (p.textContent || '').trim();
    if (!raw) return;

    // Split an optional leading country-code prefix, e.g. "+91 (IND) Mobile Number".
    const prefixMatch = raw.match(/^(\+\d+\s*\([^)]+\))\s*(.*)$/);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    const label = prefixMatch ? prefixMatch[2] : raw;

    const fieldId = `form-lead-field-${i + 1}`;
    const field = document.createElement('div');
    field.className = 'form-lead-field';

    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', fieldId);
    labelEl.textContent = label;
    field.append(labelEl);

    const inputWrap = document.createElement('div');
    inputWrap.className = 'form-lead-input';
    if (prefix) {
      const prefixEl = document.createElement('span');
      prefixEl.className = 'form-lead-prefix';
      prefixEl.textContent = prefix;
      inputWrap.append(prefixEl);
    }
    const input = document.createElement('input');
    input.setAttribute('type', /mobile|phone|number/i.test(label) ? 'tel' : 'text');
    input.setAttribute('id', fieldId);
    input.setAttribute('name', fieldId);
    input.setAttribute('placeholder', label);
    input.setAttribute('aria-label', label);
    inputWrap.append(input);

    field.append(inputWrap);
    form.append(field);
  });

  const submit = document.createElement('button');
  submit.className = 'form-lead-submit';
  submit.setAttribute('type', 'submit');
  submit.textContent = submitLabel;
  form.append(submit);
  panel.append(form);

  block.textContent = '';
  if (media.childElementCount) block.append(media);
  block.append(panel);
}
