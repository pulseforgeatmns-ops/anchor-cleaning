(function () {
  'use strict';

  var dialog = document.getElementById('portal-preview');
  var opener = null;
  var previousOverflow = '';
  var panels = dialog ? dialog.querySelectorAll('[data-portal-panel]') : [];
  var viewButtons = dialog ? dialog.querySelectorAll('[data-portal-view]') : [];

  // These are engagement events, never lead or ad conversion signals.
  function record(name, details) {
    try {
      if (typeof window.track === 'function') {
        window.track(name, Object.assign({ page_type: 'residential', design_variant: 'portal_first_v1' }, details || {}));
      }
      if (typeof window.clarity === 'function') window.clarity('event', name);
    } catch (error) {
      // Analytics must not block navigation or the preview.
    }
  }

  function setView(view) {
    panels.forEach(function (panel) { panel.hidden = panel.dataset.portalPanel !== view; });
    viewButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.portalView === view));
    });
  }

  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-portal-preview]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
        event.preventDefault();
        opener = link;
        setView(link.dataset.portalPreview);
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        record('residential_portal_preview_open', { preview_view: link.dataset.portalPreview });
      });
    });
    viewButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setView(button.dataset.portalView);
        record('residential_portal_preview_view', { preview_view: button.dataset.portalView });
      });
    });
    dialog.querySelector('[data-portal-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      var rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.style.overflow = previousOverflow;
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  var form = document.getElementById('home-cleaning-form');
  var selection = document.getElementById('town-selection');
  if (form) {
    document.querySelectorAll('[data-town]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
        event.preventDefault();
        form.elements.city.value = link.dataset.town;
        form.elements.city.dispatchEvent(new Event('input', { bubbles: true }));
        form.elements.city.dispatchEvent(new Event('change', { bubbles: true }));
        if (selection) {
          selection.textContent = 'Checking availability in ' + link.dataset.town + '. Tell us a little about your home below.';
          selection.hidden = false;
        }
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        form.elements.name.focus({ preventScroll: true });
        record('residential_town_availability_click', { town: link.dataset.town });
      });
    });
  }

  document.querySelectorAll('[data-residential-cta]').forEach(function (link) {
    link.addEventListener('click', function () {
      record('residential_availability_click', { placement: link.dataset.residentialCta });
    });
  });
  var howLink = document.querySelector('[data-portal-how]');
  if (howLink) howLink.addEventListener('click', function () { record('residential_portal_how_click'); });

  if (typeof window.clarity === 'function') {
    window.clarity('set', 'residential_design', 'portal_first_v1');
  }
}());
