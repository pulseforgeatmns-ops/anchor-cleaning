# Anchor Cleaning website

Static HTML published by GitHub Pages from `main` at the repository root.
Production: https://goanchorcleaning.com/

- `index.html`: commercial homepage and facility assessment form.
- `residential/index.html`: residential page and quote form.
- Each page loads the Google tag once in its `<head>`, configuring Google Ads
  `AW-18463870847` and the existing GA4 property `G-LCOWW1SO7N`.
- `assets/google-ads.js`: shared conversion configuration and reporting.

## Finish Google Ads lead conversion setup

The base tag is installed. The Google Ads lead action's conversion label must be
copied from its **Event snippet** (`AW-18463870847/LABEL`) into `formConversion`
in `assets/google-ads.js`. Keep it blank until the real label is available; the
account ID alone is not a conversion destination. `callConversion` is separate
and remains disabled unless a distinct phone-click action is configured.

Both forms report a lead only after the API confirms `ok: true` with a saved
`submission_id`. That ID is sent as `transaction_id` for Google Ads deduplication.
Page views, button clicks, validation errors, failed requests, and the API's 204
spam/honeypot response do not fire lead conversions. No contact details are sent
in the conversion event.

Publish by pushing the changes to `main`. After GitHub Pages finishes building,
verify both public pages include the Ads loader and correct configuration. When
changing the shared script, update its version query in both HTML files. Google
Ads' tag check and conversion-action status must be verified in the Ads account.
