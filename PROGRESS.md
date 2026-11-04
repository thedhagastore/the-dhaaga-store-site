# PROGRESS: The Dhaaga Store coming-soon site

Read this first at the start of every loop iteration.

## Done
- Reference repo reviewed (MIT licensed). Took only the ideas: ~80 ms hover-intent delay, critically damped spring when retargeting, drag-vs-click detection. Code here is original.
- Assets: 5 toys cut out (rough outline + GrabCut + keyring removal + edge defringe), checked at 2x on dark, green and cream. 520×600 WebP (2x), toy centred, attach point at (260, 14). 25–39 KB each.
- Logo: only the outer white made transparent (artwork untouched), 360 px WebP. Favicon from the yarn ball. OG image 1200×630, logo on cream.
- Page: logo → 3D rotating spinner rack (CSS perspective + rotateY, toys billboarded, maroon threads, gold hooks/rings drawn in SVG) → "Coming Soon" → sub-line → Custom Order (WhatsApp, new tab, rel=noopener) → footer.
- Verified in Playwright: auto-rotation 60 fps (worst frame 17 ms), per-toy pendulum sway, hover → toy turns to front + scales + name label, click → focused dialog, Esc / outside click / close button all close it, mobile swipe rotates then auto-rotation resumes, reduced motion → static rail.
- Layout verified at 1440×900, 768×1024, 390×844: headline + CTA above the fold, no horizontal scroll, all tap targets ≥ 44 px.

## Failing / pending
- Lighthouse (mobile): run against the live URL (the build sandbox can't reach the npm registry).
- Render deploy + custom domains + Namecheap DNS + TLS.

## Next
1. Push to GitHub `the-dhaaga-store-site` (main).
2. Render static site (publish dir `.`), check the *.onrender.com URL.
3. Add thedhaagastore.com + www, copy Render's DNS records to Namecheap (keep the email-forwarding MX + SPF TXT).
4. Lighthouse via PageSpeed Insights; fix anything below Perf 90 / A11y 95.

## DNS at Namecheap before changes (2026-11-04)
- `@` A 162.255.119.14 (Namecheap redirect/parking)
- `www` CNAME parkingpage.namecheap.com
- `@` MX eforward1–5.registrar-servers.com (email forwarding: keep)
- `@` TXT `v=spf1 include:spf.efwd.registrar-servers.com ~all` (keep)
