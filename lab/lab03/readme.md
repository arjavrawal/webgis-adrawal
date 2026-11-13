## Lab 03: Cool Corridors, now with JS
### Arjav Rawal

### What moved
The four hand-typed `<article class="card">` blocks came out of `index.html`. Each route's name, miles, shade share and description now live once, as an object in the `routes` array in `js/app.js`.

`routeCard()` and `drawRoutes()` build the cards from that array with `textContent`, so `index.html` only keeps an empty `<div class="routes">` and the Walk / Bike / Drive buttons.

### Mark's four requests
- The broken McClintock card: there are no card tags left for Mark to break; he fixes a typo by editing a string inside quotes, and JavaScript writes the markup the same way every time.
- Rio Salado Path: one new object at the end of `routes`; the fifth card, its times and its rating show up without touching the HTML.
- Dev's "how long does it take?": `minutesFor(miles, speedFor(mode))` works out walk, bike and drive times from the miles already stored and the buttons redraw the cards in that mode.
- Ms. Okafor's 62%: `shadeRating()` turns `shadePct` into Good, Patchy or Little shade, so her screen reader says "62% shaded (Good shade)".

### Return
If `minutesFor()` did `console.log(Math.round(miles / mph * 60))` instead of returning it, the function would hand back `undefined`.
Every time line in `routeCard()` would then read "Walk: undefined min", and the Bike and Drive buttons would only redraw that same broken line; the right number would sit in the Console where Dev can't see it.
