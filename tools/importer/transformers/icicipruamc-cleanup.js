/* eslint-disable */
/* global WebImporter */

/**
 * Site-wide cleanup transformer for ICICI Prudential AMC (icicipruamc).
 *
 * Removes non-authorable site chrome (header, footer) and third-party / decorative
 * overlays so the import contains only page-level authorable content.
 *
 * All selectors are sourced from the captured DOM in migration-work/cleaned.html
 * unless noted otherwise. Where a selector could not be observed in the static
 * snapshot (delayed vendor injections), the source is documented on the line.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove elements that would corrupt block parsing or are decorative/third-party
    // overlays. Run first so parsers only ever see real, de-duplicated content.
    WebImporter.DOMUtils.remove(element, [
      // slick carousel CLONE slides duplicate the real slides (infinite-loop clones).
      // Must go before the carousel-promo parser so slides are not double-counted.
      // Source: migration-work/cleaned.html (5 x ".slick-cloned").
      '.slick-cloned',

      // NotifyVisitors lead-form popup. The live element id carries a session-specific
      // numeric suffix (e.g. #notify-visitors-leadform-notification_7978) and is a
      // delayed injection, so match by id prefix as well as the exact observed id.
      // Source: task brief / live page (delayed vendor injection, absent from snapshot).
      '#notify-visitors-leadform-notification_7978',
      '[id^="notify-visitors-leadform-notification"]',

      // Floating accessibility widget. Source: migration-work/cleaned.html
      // (div.accessibility-widget.installbar-visible).
      'div.accessibility-widget',

      // Haptik chat widget wrapper + its iframe. Source: migration-work/cleaned.html
      // (#haptik-xdk-wrapper, iframe[title="haptik-xdk"]).
      '#haptik-xdk-wrapper',
      'iframe[title="haptik-xdk"]',

      // Sticky "install our app" banner. Source: migration-work/cleaned.html (div.install-bar).
      'div.install-bar',

      // reCAPTCHA (invisible) iframe + badge. Source: migration-work/cleaned.html
      // (iframe[title="reCAPTCHA"], .grecaptcha-badge).
      'iframe[title="reCAPTCHA"]',
      '.grecaptcha-badge',

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
      'img[src^="blob:"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome and any leftover non-content elements.
    // Header/footer are auto-populated regions handled separately, not page body.
    WebImporter.DOMUtils.remove(element, [
      // Site header (a div, not a <header> tag): class "header accessibility-exempt".
      // Scoped to the App shell so nested block sub-elements named "header-*" are untouched.
      // Source: migration-work/cleaned.html (#root > div.App > div.header.accessibility-exempt).
      '#root > div.App > div.header',

      // Site footer. Source: migration-work/cleaned.html (#root > div.App > footer.footer).
      '#root > div.App > footer.footer',
      'footer.footer',

      // Leftover non-authorable elements. No authorable iframes exist on this page
      // (the knowledge/video block uses <img> thumbnails + anchors, verified in cleaned.html).
      'iframe',
      'script',
      'noscript',
      'link',
      'source',
    ]);
  }
}
