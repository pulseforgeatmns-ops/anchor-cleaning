// Use the label from the Google Ads lead action's event snippet (after the slash).
// An empty label deliberately disables Ads conversion reporting until configured.
window.ANCHOR_ANALYTICS = {
  ads: 'AW-18463870847',
  formConversion: '',
  callConversion: ''
};

function sendAdsConversion(label, submissionId) {
  var ads = window.ANCHOR_ANALYTICS.ads;
  if (!ads || !label || typeof window.gtag !== 'function') return;
  var params = { send_to: ads + '/' + label };
  if (submissionId) params.transaction_id = String(submissionId);
  // A tracking failure must never turn an accepted request into a form error.
  try { window.gtag('event', 'conversion', params); } catch (_) {}
}

var anchorTrackedLeadIds = Object.create(null);
function trackAnchorLead(result, eventName, params) {
  // The API returns 201 with ok + submission_id only after saving a real lead.
  // Its honeypot response is 204 and must not count as a conversion.
  if (!result || result.ok !== true || !result.submission_id) return;
  var submissionId = String(result.submission_id);
  if (anchorTrackedLeadIds[submissionId]) return;
  anchorTrackedLeadIds[submissionId] = true;
  try { track(eventName, params); } catch (_) {}
  sendAdsConversion(window.ANCHOR_ANALYTICS.formConversion, submissionId);
}
