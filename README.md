# csi

Construction Services, Inc. — Architectural Metal Products.

## Contents

- `index.html` — home page. A single file: fonts load from Google Fonts and
  photography from the Uploadcare CDN (`3unloi5wlp.ucarecd.net`), with
  styles and scripts inline, so it runs by opening the file in a browser
  with no build step or server.
- `about.html`, `products.html`, `case-studies.html`, `architectural-metalwork.html`,
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

The menu runs Products, the four sector pages and Laser, then Case Studies and About
Us on the right. About Us drops down to Contact Us and Careers: a mouse
opens it by hovering, and the arrow beside it opens it for touch and
keyboard. At 1280px and below the menu folds into the burger, which lists
Contact Us and Careers under About Us. A Get a quote button, to the Contact
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
