## Lab 02: Cool Corridors
### Arjav Rawal

### What I built
A two-page site for Cool Corridors: a semantic home page (about, route cards, walk schedule table, sign-up form, footer) and a map page carried over from Classwork 2.
Both pages share one header, one nav and one `style.css`; the brand kit lives in `:root` and the map layout rules are scoped under `.app` so they only touch the map page.

### Phone test
At 390 × 844 the console read **916 / 916** first: the 900px banner was forcing the page wide and the browser zoomed out to fit it. Adding `img { max-width: 100%; height: auto; }` in the CSS dropped it to **497 / 497**.
The schedule table was still too wide, so I wrapped it in `<div class="table-wrap">` with `overflow-x: auto`, which let it scroll inside its own box and brought the page to **390 / 390**. Nav links measured 44.8px and checkbox labels 44px tall.

### Screen reader test
Lighthouse flagged **color contrast** on the current-page nav link: sun-yellow text (`--sun`) on the `aria-current` highlight (12% white over `--shade`) came out at about 4.4:1, under the 4.5:1 minimum.
I changed the highlight in `:root` from `--glow: rgba(255, 255, 255, 0.12)` to `rgba(0, 0, 0, 0.25)`, a darker inset that brings the pair to about 7.9:1 without changing any brand color. The focus ring stayed visible tabbing from the header down to the Clear button.

### Mark's doc
I'd ask Mark (and his designer friend) to check every text and background pair in the brand kit for contrast before handing it over, including hover and "current page" states, not only the base colors.
The kit looked fine color by color, but one combination failed for Ms. Okafor, and that's the sort of gap a quick contrast check catches early.
