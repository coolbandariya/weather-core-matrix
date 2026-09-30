# Weather dashboard quality checklist

Use this checklist when changing the browser-based weather lookup.

## Search behavior
- [ ] Submit a valid city with the search button.
- [ ] Submit a valid city with Enter.
- [ ] Try an empty value and a value containing only spaces.
- [ ] Try a city containing spaces and non-ASCII characters.
- [ ] Confirm a failed request produces a recoverable error, not stale weather presented as current.
- [ ] Confirm loading feedback is cleared after both success and failure.

## Result integrity
- [ ] Confirm the displayed location matches the requested city/provider response.
- [ ] Confirm missing optional fields do not render as `undefined`, `NaN`, or broken units.
- [ ] Confirm units and timestamps are labeled where provided.
- [ ] Confirm the interface does not imply that weather data is a safety-critical alert.

## Accessibility and layout
- [ ] Complete the search using only a keyboard.
- [ ] Verify focus remains visible and results are understandable to assistive technology.
- [ ] Check narrow mobile width and desktop width.
- [ ] Check long city names and provider error messages for overflow.

## Before release
Run the repository CI workflow and manually verify the provider behavior with a valid configuration. Never commit API keys or real user data.