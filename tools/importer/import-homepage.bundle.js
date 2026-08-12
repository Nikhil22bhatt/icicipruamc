/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-promo.js
  function parse(element, { document }) {
    const cells = [];
    let slides = Array.from(element.querySelectorAll(".slick-slide"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".promotional-container, .banner-container"));
    }
    slides.forEach((slide) => {
      const image = slide.querySelector(".banner-img-wrapper img, .banner-right-content img, img");
      const heading = slide.querySelector('h1, h2, h3, .promotional-banner-heading, [class*="banner-heading"]');
      const description = slide.querySelector('p, .promotional-banner-description, [class*="banner-description"]');
      const ctaButtons = Array.from(slide.querySelectorAll(".banner-button-wrapper button, .banner-left-content button"));
      const contentCell = [];
      if (heading && heading.textContent.trim()) contentCell.push(heading);
      if (description && description.textContent.trim()) contentCell.push(description);
      ctaButtons.forEach((btn) => {
        const label = btn.textContent.trim();
        if (!label) return;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.textContent = label;
        p.appendChild(a);
        contentCell.push(p);
      });
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-strip.js
  function parse2(element, { document }) {
    const iconImage = element.querySelector("img.rupee-image, .rupee-image-wrapper img.rupee-image");
    const title = element.querySelector(".banner-title");
    const logo = element.querySelector("img.banner-image, .banner-title-wrapper img");
    const subtitle = element.querySelector(".banner-subtitle");
    const contentCell = [];
    if (title && title.textContent.trim()) contentCell.push(title);
    if (logo) contentCell.push(logo);
    if (subtitle && subtitle.textContent.trim()) contentCell.push(subtitle);
    const ctaSource = element.querySelector("a.banner-button-link, .banner-button-wrapper a[href]");
    let ctaCell = "";
    if (ctaSource) {
      const href = ctaSource.getAttribute("href");
      const label = (ctaSource.textContent || "").trim() || "Learn More";
      const a = document.createElement("a");
      if (href) a.setAttribute("href", href);
      a.textContent = label;
      ctaCell = a;
    }
    if (!iconImage && !contentCell.length && !ctaCell) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [iconImage || "", contentCell.length ? contentCell : "", ctaCell || ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-strip", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklink.js
  function parse3(element, { document }) {
    const cells = [];
    element.querySelectorAll(".sr-only, .slick-dots").forEach((n) => n.remove());
    let items = Array.from(element.querySelectorAll("li.quick-links-item, .quick-links-item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(".white-card"));
    }
    items.forEach((item) => {
      const icon = item.querySelector("img.icon__content, .icon img, img");
      const link = item.querySelector("a.white-card__link, a[href], a");
      const label = item.querySelector("p, .body4 p");
      let labelCell = "";
      const labelText = label ? label.textContent.trim() : link ? link.textContent.trim() : "";
      if (labelText) {
        const a = document.createElement("a");
        const href = link ? link.getAttribute("href") : null;
        if (href) a.setAttribute("href", href);
        a.textContent = labelText;
        labelCell = a;
      }
      if (icon || labelCell) {
        cells.push([icon || "", labelCell || ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quicklink", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-video.js
  function parse4(element, { document }) {
    const cells = [];
    const cards = Array.from(element.querySelectorAll(".file-card"));
    cards.forEach((card) => {
      const thumb = card.querySelector(".thumb > img, .thumb img.w-100, .thumb img:not(.playIcon img)") || card.querySelector(".thumb img");
      const titleLink = card.querySelector("a.file-card__title-link, .file-card__info__heading a, h3 a");
      const duration = card.querySelector(".duration");
      const contentCell = [];
      if (titleLink) {
        const href = titleLink.getAttribute("href");
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        if (href) a.setAttribute("href", href);
        a.textContent = titleLink.textContent.trim();
        h3.appendChild(a);
        contentCell.push(h3);
      }
      if (duration && duration.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = duration.textContent.trim();
        contentCell.push(p);
      }
      if (thumb || contentCell.length) {
        cells.push([thumb || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-fund.js
  function parse5(element, { document }) {
    const doc = document;
    const preNodes = [];
    const headingSrc = element.querySelector(":scope > .MuiGrid-container h3, .fund-description") ? element.querySelector('h3.MuiTypography-h2, h3[class*="Bold"]') : element.querySelector("h3");
    if (headingSrc && headingSrc.textContent.trim()) {
      const h2 = doc.createElement("h2");
      h2.textContent = headingSrc.textContent.trim();
      preNodes.push(h2);
    }
    const subtitle = element.querySelector(".fund-description");
    if (subtitle && subtitle.textContent.trim()) {
      const p = doc.createElement("p");
      p.textContent = subtitle.textContent.trim();
      preNodes.push(p);
    }
    const perfLabel = element.querySelector('.perf-dropdown label, [id$="-label"]');
    const perfValue = element.querySelector(".perf-dropdown .MuiSelect-select, .MuiSelect-select");
    if (perfLabel && perfValue && perfLabel.textContent.trim() && perfValue.textContent.trim()) {
      const p = doc.createElement("p");
      p.textContent = `${perfLabel.textContent.trim()}: ${perfValue.textContent.trim()}`;
      preNodes.push(p);
    }
    const cells = [];
    const cards = Array.from(element.querySelectorAll(".funds-card"));
    cards.forEach((card) => {
      const riskometer = card.querySelector("img.riskometer, .riskometer-btn img");
      const contentCell = [];
      const nameLink = card.querySelector(".funds-card__heading a, h3 a");
      if (nameLink) {
        const href = nameLink.getAttribute("href");
        const h3 = doc.createElement("h3");
        const a = doc.createElement("a");
        if (href) a.setAttribute("href", href);
        const nameSpans = Array.from(nameLink.querySelectorAll("span"));
        const nameText = nameSpans.length ? nameSpans.map((s) => s.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).join(" ") : nameLink.textContent.replace(/\s+/g, " ").trim();
        a.textContent = nameText;
        h3.appendChild(a);
        contentCell.push(h3);
      }
      const plan = card.querySelector(".funds-card__content > p.MuiTypography-body4, .funds-card__content > p");
      if (plan && plan.textContent.trim()) {
        const p = doc.createElement("p");
        p.textContent = plan.textContent.replace(/\s+/g, " ").trim();
        contentCell.push(p);
      }
      const chips = Array.from(card.querySelectorAll(".funds-card__chips .MuiChip-label, .chip .MuiChip-label"));
      const chipLabels = chips.map((c) => c.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
      if (chipLabels.length) {
        const p = doc.createElement("p");
        p.textContent = chipLabels.join(" | ");
        contentCell.push(p);
      }
      const cagrLabels = Array.from(card.querySelectorAll(".label-icon-wrapper > p.text-blue-light"));
      const cagrLabelText = cagrLabels.map((p) => p.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).join(" ");
      if (cagrLabelText) {
        const p = doc.createElement("p");
        p.textContent = cagrLabelText;
        contentCell.push(p);
      }
      const cagrValue = card.querySelector(".cagr-value");
      if (cagrValue) {
        const pct = (cagrValue.textContent || "").replace(/\s+/g, " ").trim();
        if (pct) {
          const p = doc.createElement("p");
          p.textContent = pct;
          contentCell.push(p);
        }
      }
      const asOn = card.querySelector(".funds-card__date");
      if (asOn && asOn.textContent.trim()) {
        const p = doc.createElement("p");
        p.textContent = asOn.textContent.replace(/\s+/g, " ").trim();
        contentCell.push(p);
      }
      const investBtn = card.querySelector('.funds-card__actions button, button[id^="invest-btn"]');
      if (investBtn && investBtn.textContent.trim()) {
        const p = doc.createElement("p");
        const a = doc.createElement("a");
        a.textContent = investBtn.textContent.trim();
        p.appendChild(a);
        contentCell.push(p);
      }
      if (riskometer || contentCell.length) {
        cells.push([riskometer || "", contentCell.length ? contentCell : ""]);
      }
    });
    const postNodes = [];
    const exploreBtn = element.querySelector(".explore button, .explore .explore-text, .explore");
    if (exploreBtn && exploreBtn.textContent.trim()) {
      const p = doc.createElement("p");
      const a = doc.createElement("a");
      a.setAttribute("href", "/mutual-fund");
      a.textContent = exploreBtn.textContent.replace(/\s+/g, " ").trim();
      p.appendChild(a);
      postNodes.push(p);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-fund", cells });
    element.replaceWith(...preNodes, block, ...postNodes);
  }

  // tools/importer/parsers/cards-category.js
  var ICON_BASE = "/icons/funds";
  var FUND_ICONS = {
    EQUITY_FUNDS: `${ICON_BASE}/equity-funds.svg`,
    HYBRID_FUNDS: `${ICON_BASE}/hybrid-funds.svg`,
    DEBT_FUNDS: `${ICON_BASE}/debt-funds.svg`,
    SOLUTION_ORIENTED_FUNDS: `${ICON_BASE}/solution-oriented-funds.svg`,
    FUND_OF_FUNDS: `${ICON_BASE}/fund-of-funds.svg`,
    INDEX_FUNDS: `${ICON_BASE}/index-funds.svg`
  };
  function parse6(element, { document }) {
    const cells = [];
    let items = Array.from(element.querySelectorAll(":scope > li, li"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("a.planner-card"));
    }
    items.forEach((item) => {
      const cardLink = item.matches("a.planner-card") ? item : item.querySelector("a.planner-card, a[href]");
      const href = cardLink ? cardLink.getAttribute("href") : null;
      let icon = null;
      const fundKey = href ? (href.match(/fund=([A-Z_]+)/) || [])[1] : null;
      const iconPath = fundKey ? FUND_ICONS[fundKey] : null;
      if (iconPath) {
        icon = document.createElement("img");
        icon.setAttribute("src", iconPath);
        const labelForAlt = item.querySelector("p");
        icon.setAttribute("alt", labelForAlt ? labelForAlt.textContent.replace(/\s+/g, " ").trim() : "");
      } else {
        icon = item.querySelector(".planner-card_graphic img, img");
      }
      const labelEl = item.querySelector("p");
      let labelCell = "";
      const labelText = labelEl ? labelEl.textContent.replace(/\s+/g, " ").trim() : cardLink ? cardLink.textContent.replace(/\s+/g, " ").trim() : "";
      if (labelText) {
        const a = document.createElement("a");
        if (href) a.setAttribute("href", href);
        a.textContent = labelText;
        labelCell = a;
      }
      if (icon || labelCell) {
        cells.push([icon || "", labelCell || ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form-lead.js
  function parse7(element, { document }) {
    const doc = document;
    const preNodes = [];
    const eyebrow = element.querySelector(".expert-consult__tagline");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = doc.createElement("p");
      p.textContent = eyebrow.textContent.replace(/\s+/g, " ").trim();
      preNodes.push(p);
    }
    const image = element.querySelector("img.graphic, .expert-consult-wrapper__image_text img.graphic");
    const contentCell = [];
    const heading = element.querySelector("h2.title-experts, .title-experts, h2");
    if (heading && heading.textContent.trim()) {
      const h2 = doc.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      contentCell.push(h2);
    }
    const tagline = element.querySelector("p.tag-line, .tag-line");
    if (tagline && tagline.textContent.trim()) {
      const p = doc.createElement("p");
      p.textContent = tagline.textContent.replace(/\s+/g, " ").trim();
      contentCell.push(p);
    }
    const nameLabel = element.querySelector('#consult-your-name-label, [id$="your-name-label"]');
    const mobileLabel = element.querySelector('#consult-mobile-number-label, [id$="mobile-number-label"]');
    const cityLabel = element.querySelector('#consult-city-state-label, [id$="city-state-label"]');
    const fieldLabels = [];
    if (nameLabel && nameLabel.textContent.trim()) {
      fieldLabels.push(nameLabel.textContent.replace(/\s+/g, " ").trim());
    }
    if (mobileLabel && mobileLabel.textContent.trim()) {
      fieldLabels.push(`+91 (IND) ${mobileLabel.textContent.replace(/\s+/g, " ").trim()}`);
    }
    if (cityLabel && cityLabel.textContent.trim()) {
      fieldLabels.push(cityLabel.textContent.replace(/\s+/g, " ").trim());
    }
    fieldLabels.forEach((label) => {
      const p = doc.createElement("p");
      p.textContent = label;
      contentCell.push(p);
    });
    const submit = element.querySelector(".consult-btn, button.consult-btn");
    if (submit && submit.textContent.trim()) {
      const p = doc.createElement("p");
      const a = doc.createElement("a");
      a.textContent = submit.textContent.replace(/\s+/g, " ").trim();
      p.appendChild(a);
      contentCell.push(p);
    }
    const postNodes = [];
    const disclaimerSpans = Array.from(element.querySelectorAll(".MuiGrid-root.mt-2 span, .css-rfnosa.mt-2 span"));
    const disclaimerText = disclaimerSpans.map((s) => s.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    if (disclaimerText) {
      const p = doc.createElement("p");
      p.textContent = disclaimerText;
      postNodes.push(p);
    }
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", contentCell.length ? contentCell : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "form-lead", cells });
    element.replaceWith(...preNodes, block, ...postNodes);
  }

  // tools/importer/transformers/icicipruamc-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // slick carousel CLONE slides duplicate the real slides (infinite-loop clones).
        // Must go before the carousel-promo parser so slides are not double-counted.
        // Source: migration-work/cleaned.html (5 x ".slick-cloned").
        ".slick-cloned",
        // NotifyVisitors lead-form popup. The live element id carries a session-specific
        // numeric suffix (e.g. #notify-visitors-leadform-notification_7978) and is a
        // delayed injection, so match by id prefix as well as the exact observed id.
        // Source: task brief / live page (delayed vendor injection, absent from snapshot).
        "#notify-visitors-leadform-notification_7978",
        '[id^="notify-visitors-leadform-notification"]',
        // Floating accessibility widget. Source: migration-work/cleaned.html
        // (div.accessibility-widget.installbar-visible).
        "div.accessibility-widget",
        // Haptik chat widget wrapper + its iframe. Source: migration-work/cleaned.html
        // (#haptik-xdk-wrapper, iframe[title="haptik-xdk"]).
        "#haptik-xdk-wrapper",
        'iframe[title="haptik-xdk"]',
        // Sticky "install our app" banner. Source: migration-work/cleaned.html (div.install-bar).
        "div.install-bar",
        // reCAPTCHA (invisible) iframe + badge. Source: migration-work/cleaned.html
        // (iframe[title="reCAPTCHA"], .grecaptcha-badge).
        'iframe[title="reCAPTCHA"]',
        ".grecaptcha-badge",
        // Analytics / marketing tracking pixels (1x1 beacons injected by tag managers).
        // These are non-content <img> beacons (Bing UET, DoubleClick, Facebook, Google
        // Analytics) that otherwise leak into the imported page as empty <img> paragraphs.
        // Source: imported output (bat.bing.com beacons appeared inside the form section).
        'img[src*="bat.bing.com"]',
        'img[src*="doubleclick.net"]',
        'img[src*="google-analytics.com"]',
        'img[src*="facebook.com/tr"]',
        'img[width="1"][height="1"]',
        // Runtime blob: images (lazy canvas/video-frame decorations the SPA injects).
        // They have no portable source and render broken once imported.
        // Source: imported output (blob: images leaked into the "Our Funds" section).
        'img[src^="blob:"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Site header (a div, not a <header> tag): class "header accessibility-exempt".
        // Scoped to the App shell so nested block sub-elements named "header-*" are untouched.
        // Source: migration-work/cleaned.html (#root > div.App > div.header.accessibility-exempt).
        "#root > div.App > div.header",
        // Site footer. Source: migration-work/cleaned.html (#root > div.App > footer.footer).
        "#root > div.App > footer.footer",
        "footer.footer",
        // Leftover non-authorable elements. No authorable iframes exist on this page
        // (the knowledge/video block uses <img> thumbnails + anchors, verified in cleaned.html).
        "iframe",
        "script",
        "noscript",
        "link",
        "source"
      ]);
    }
  }

  // tools/importer/transformers/icicipruamc-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function resolveTopLevelContainer(matched, rootHome) {
    if (!matched) return null;
    if (!rootHome) return matched;
    let node = matched;
    while (node && node.parentElement && node.parentElement !== rootHome) {
      node = node.parentElement;
      if (node === rootHome || node.tagName === "BODY" || node.tagName === "HTML") {
        break;
      }
    }
    return node && node.parentElement === rootHome ? node : matched;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && Array.isArray(payload.template.sections) ? payload.template.sections : [];
    if (sections.length < 2) return;
    const doc = payload && payload.document || element && element.ownerDocument;
    if (!doc) return;
    const rootHome = element.querySelector(".root-home") || element;
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
        container: resolveTopLevelContainer(matched, rootHome)
      };
    });
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, container } = resolved[i];
      if (!container) continue;
      if (section && section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        container.appendChild(metadataBlock);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        container.parentElement.insertBefore(hr, container);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-promo": parse,
    "columns-strip": parse2,
    "cards-quicklink": parse3,
    "cards-video": parse4,
    "cards-fund": parse5,
    "cards-category": parse6,
    "form-lead": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "ICICI Prudential AMC homepage: hero carousel, iSIF promo strip, quick links, knowledge centre (video/blog tabs), recommended schemes, our funds categories, consult-experts lead form. Includes header nav with mega-menus and full footer.",
    urls: [
      "https://www.icicipruamc.com/"
    ],
    blocks: [
      {
        name: "carousel-promo",
        instances: [".promotional-bannerv2"]
      },
      {
        name: "columns-strip",
        instances: [".sif-banner.sif-banner-home"]
      },
      {
        name: "cards-quicklink",
        instances: [".quick-links-list"]
      },
      {
        name: "cards-video",
        instances: ["#kc-tabpanel"]
      },
      {
        name: "cards-fund",
        instances: [".funds-section .fund-wrapper"]
      },
      {
        name: "cards-category",
        instances: [".promotional-card-container"]
      },
      {
        name: "form-lead",
        instances: [".expert-consult"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero promo banner carousel",
        selector: "#root > div.App > div.root-home > div:nth-of-type(1)",
        style: null,
        blocks: ["carousel-promo"],
        defaultContent: []
      },
      {
        id: "isif-promo-strip",
        name: "Introducing iSIF promo strip",
        selector: ".sif-banner.sif-banner-home",
        style: null,
        blocks: ["columns-strip"],
        defaultContent: []
      },
      {
        id: "quick-links",
        name: "Quick Links",
        selector: ".quick-links.quick-links-homepage",
        style: null,
        blocks: ["cards-quicklink"],
        defaultContent: ["h2"]
      },
      {
        id: "knowledge-centre",
        name: "Knowledge Centre",
        selector: ".knowledge",
        style: null,
        blocks: ["cards-video"],
        defaultContent: ["h2", ".chip-container"]
      },
      {
        id: "recommended-schemes",
        name: "Recommended Schemes",
        selector: "#root > div.App > div.root-home > div.MuiContainer-root.MuiContainer-maxWidthLg.container.css-1qsxih2:nth-of-type(5)",
        style: null,
        blocks: ["cards-fund"],
        defaultContent: ["h2"]
      },
      {
        id: "our-funds",
        name: "Our Funds",
        selector: "#root > div.App > div.root-home > div.MuiContainer-root.MuiContainer-maxWidthLg.container.css-1qsxih2:nth-of-type(6)",
        style: null,
        blocks: ["cards-category"],
        defaultContent: ["h2"]
      },
      {
        id: "consult-experts",
        name: "Consult our Experts",
        selector: ".funds-section.pt-12",
        style: null,
        blocks: ["form-lead"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const isHomepage = rawPath === "" || rawPath === "/serve-index";
      const path = WebImporter.FileUtils.sanitizePath(isHomepage ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
