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

Photos come in two batches on the CDN. The first (`hq-…` JPEGs and PNGs) is
asked for as resized copies. The second (AVIF files named for their page or
project, such as `Case Studies - Vanderbilt3.avif`) may not be resizable by
the CDN, so an `<img>` asks for a resized copy and falls back to the
original file (`data-raw`), and a CSS background links the original.

`projects.html#stair-systems` (likewise `#architectural-metalwork`,
`#rail-systems`, `#canopies`, `#laser-cutting`) opens the portfolio
filtered to that sector; the home page's hero buttons and the About page's
sector list link there.

### Home page sections

Hero with rotating sector frames · Our mission (animated stat counters) ·
Leaders in architectural metalwork (S letterform) · One source for the
ornamental package (I letterform) · Laser cutting carousel · Get a quote ·
See our work on display (venue rail) · Employment · Case studies · Footer.
