/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselPromoParser from './parsers/carousel-promo.js';
import columnsStripParser from './parsers/columns-strip.js';
import cardsQuicklinkParser from './parsers/cards-quicklink.js';
import cardsVideoParser from './parsers/cards-video.js';
import cardsFundParser from './parsers/cards-fund.js';
import cardsCategoryParser from './parsers/cards-category.js';
import formLeadParser from './parsers/form-lead.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/icicipruamc-cleanup.js';
import sectionsTransformer from './transformers/icicipruamc-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'carousel-promo': carouselPromoParser,
  'columns-strip': columnsStripParser,
  'cards-quicklink': cardsQuicklinkParser,
  'cards-video': cardsVideoParser,
  'cards-fund': cardsFundParser,
  'cards-category': cardsCategoryParser,
  'form-lead': formLeadParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'ICICI Prudential AMC homepage: hero carousel, iSIF promo strip, quick links, knowledge centre (video/blog tabs), recommended schemes, our funds categories, consult-experts lead form. Includes header nav with mega-menus and full footer.',
  urls: [
    'https://www.icicipruamc.com/',
  ],
  blocks: [
    {
      name: 'carousel-promo',
      instances: ['.promotional-bannerv2'],
    },
    {
      name: 'columns-strip',
      instances: ['.sif-banner.sif-banner-home'],
    },
    {
      name: 'cards-quicklink',
      instances: ['.quick-links-list'],
    },
    {
      name: 'cards-video',
      instances: ['#kc-tabpanel'],
    },
    {
      name: 'cards-fund',
      instances: ['.funds-section .fund-wrapper'],
    },
    {
      name: 'cards-category',
      instances: ['.promotional-card-container'],
    },
    {
      name: 'form-lead',
      instances: ['.expert-consult'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero promo banner carousel',
      selector: '#root > div.App > div.root-home > div:nth-of-type(1)',
      style: null,
      blocks: ['carousel-promo'],
      defaultContent: [],
    },
    {
      id: 'isif-promo-strip',
      name: 'Introducing iSIF promo strip',
      selector: '.sif-banner.sif-banner-home',
      style: null,
      blocks: ['columns-strip'],
      defaultContent: [],
    },
    {
      id: 'quick-links',
      name: 'Quick Links',
      selector: '.quick-links.quick-links-homepage',
      style: null,
      blocks: ['cards-quicklink'],
      defaultContent: ['h2'],
    },
    {
      id: 'knowledge-centre',
      name: 'Knowledge Centre',
      selector: '.knowledge',
      style: null,
      blocks: ['cards-video'],
      defaultContent: ['h2', '.chip-container'],
    },
    {
      id: 'recommended-schemes',
      name: 'Recommended Schemes',
      selector: '#root > div.App > div.root-home > div.MuiContainer-root.MuiContainer-maxWidthLg.container.css-1qsxih2:nth-of-type(5)',
      style: null,
      blocks: ['cards-fund'],
      defaultContent: ['h2'],
    },
    {
      id: 'our-funds',
      name: 'Our Funds',
      selector: '#root > div.App > div.root-home > div.MuiContainer-root.MuiContainer-maxWidthLg.container.css-1qsxih2:nth-of-type(6)',
      style: null,
      blocks: ['cards-category'],
      defaultContent: ['h2'],
    },
    {
      id: 'consult-experts',
      name: 'Consult our Experts',
      selector: '.funds-section.pt-12',
      style: null,
      blocks: ['form-lead'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup (adds <hr> section breaks in afterTransform).
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    //    Skip elements already replaced by a prior parser (detached from DOM)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage URL to /index).
    //    The local re-import fallback serves the cached full-capture DOM at
    //    /serve-index.html; treat that as the homepage too so it lands at /index.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const isHomepage = rawPath === '' || rawPath === '/serve-index';
    const path = WebImporter.FileUtils.sanitizePath(isHomepage ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
