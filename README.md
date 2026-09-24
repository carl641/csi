# csi

Construction Services, Inc. — Architectural Metal Products.

## Contents

- `index.html` — home page. A single file: fonts load from Google Fonts and
  photography from the Uploadcare CDN (`3unloi5wlp.ucarecd.net`), with
  styles and scripts inline, so it runs by opening the file in a browser
  with no build step or server.
- `about.html`, `case-studies.html`, `projects.html` (Portfolio),
  `laser.html`, `careers.html`, `contact.html` — the pages in the nav, in
  the home page's design. They share `site.css` and `site.js`; anything
  only one page uses sits in that page's own `<style>` or `<script>`. The
  masthead, menu, buttons and footer in `site.css` copy the ones inline in
  `index.html`, so change both together.
- `img/` — images not on the CDN yet. `cad-stair-dannelly-field.webp`, the
  engineering drawing on the About page, is cut from a screenshot of the
  old site until the original file is uploaded.

`projects.html#stair-systems` (likewise `#architectural-metalwork`,
`#rail-systems`, `#canopies`, `#laser-cutting`) opens the portfolio
filtered to that sector; the home page's hero buttons and the About page's
sector list link there.

### Home page sections

Hero with rotating sector frames · Our mission (animated stat counters) ·
Leaders in architectural metalwork (S letterform) · One source for the
ornamental package (I letterform) · Laser cutting carousel · Get a quote ·
See our work on display (venue rail) · Employment · Case studies · Footer.
