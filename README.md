# csi

Construction Services, Inc. — Architectural Metal Products.

## Contents

- `index.html` — home page. A single file: fonts load from Google Fonts and
  photography from the Uploadcare CDN (`3unloi5wlp.ucarecd.net`), with
  styles and scripts inline, so it runs by opening the file in a browser
  with no build step or server.
- `about.html`, `products.html`, `resources.html`, `case-studies.html`, `architectural-metalwork.html`,
  `monumental-stairs.html`, `rail-systems.html`, `canopies.html`,
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

The four sector pages show each project as a card with its own small
gallery; the home page's hero buttons and the About page's product list
open them.

The menu runs Products, Case Studies, Resources and About Us. Products drops down to
the four sector pages and Laser, and About Us to Contact Us and Careers: a
mouse opens them by hovering, and the arrow beside each opens it for touch
and keyboard. At 1180px and below the menu folds into the burger, which
lists each dropdown's pages under it. A Get a quote button, to the Contact
page, closes the menu on the right, and the burger menu's list. The footer
still lists every page.

### Home page sections

Hero with rotating sector frames · Our mission (animated stat counters) ·
Leaders in architectural metalwork (S letterform) · One source for the
ornamental package (I letterform) · Laser cutting carousel ·
See our work on display (venue rail) · Employment · Case studies ·
Get a quote · Footer.

The Products page sums up the four product lines as large photo cards,
each linking to its page, with laser cutting highlighted on a dark band
of its own.

The Resources page is for architects and contractors: spec and detail
downloads, finishes, FAQs, safety and credentials, laser-cut panel
railings and who to call. Anything still to be supplied by CSI (the
download files, lead times, EMR, awards, contact names) is set as a
placeholder with suggested content, in a dashed outline with a
Placeholder tag (`.ph` and `.ph-tag` in the page's styles), so it can be
found and replaced.

Every Get a quote section shares one background photo, set once as
`--quote-photo` at the top of `site.css` (and in `index.html`'s own copy
of the tokens). Change it there to swap the photo on every page.
