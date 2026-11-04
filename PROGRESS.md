# PROGRESS: The Dhaaga Store coming-soon site

Read this first at the start of every loop iteration.

## Live
- Site: https://thedhaagastore.com (www → apex redirect, set by Render)
- Render: https://the-dhaaga-store-site.onrender.com (static site, publish dir `.`, no build command; deployed from the public repo URL)
- Repo: https://github.com/thedhagastore/the-dhaaga-store-site

## Done
- Reference repo reviewed (MIT licensed). Took only the ideas: ~80 ms hover-intent delay, critically damped spring when retargeting, drag-vs-click detection. Code here is original.
- Assets: 5 toys cut out (rough outline + GrabCut + keyring removal + edge defringe), checked at 2x on dark, green and cream. 520×600 WebP (2x), toy centred, attach point at (260, 14). 25–39 KB each.
- Logo: only the outer white made transparent (artwork untouched), 360 px WebP. Favicon from the yarn ball. OG image 1200×630, logo on cream.
- Page: logo → 3D rotating spinner rack → "Coming Soon" → sub-line → Custom Order (WhatsApp, new tab, rel=noopener) → footer.
- Verified in Playwright: 60 fps rotation, per-toy sway, hover → front + scale + name, click → dialog, Esc/outside/close all close it, swipe works, reduced motion → static rail. 1440×900, 768×1024, 390×844: CTA above the fold, no horizontal scroll, tap targets ≥ 44 px, no console errors.
- Lighthouse (mobile, PageSpeed Insights, 2026-11-04): Performance 99, Accessibility 100, Best Practices 100, SEO 100. Page weight ≈ 0.35 MB.
- DNS at Namecheap: `www` CNAME → the-dhaaga-store-site.onrender.com (was parkingpage.namecheap.com); `@` URL Redirect removed; `@` A 216.24.57.1 added. Email-forwarding MX + SPF TXT untouched. Both domains verified in Render.

## Update 2026-11-04 (v2)
- Product photos replaced with 10 AI-generated studio renders (Figma AI, gpt-image), cut out and exported to `assets/toys/` (22–57 KB each). New names: Bun Bun, Froggy, Berry, Inky, Buzz (placeholders, edit in `main.js`).
- Stand is now a wide oval rack (toys placed on an ellipse each frame). Each toy has a `hang` point so the thread meets it where it naturally hangs.
- Mobile: oval spreads to the screen edges with deeper perspective so one toy reads clearly at the front. Reduced motion: a straight rail that scrolls sideways inside the stand.
- Verified: 60 fps, hover/click/Esc/outside click, swipe, no horizontal page scroll, CTA above the fold at 1440×900, 768×1024, 390×844.
- Perf: half-size `-sm.webp` toys via srcset, front toy preloaded, CSS inlined in index.html (styles.css removed), Google Fonts loaded without blocking, back toys inert + narrower hit areas (tap-target audit).
- Lighthouse mobile on thedhaagastore.com (20:26 IST): Performance 95, Accessibility 100, Best Practices 100, SEO 100. LCP 3.0 s, CLS 0.021.

## Pending
- Nothing. TLS issued for both domains.

## Notes
- Deployed from the public repo URL, so pushes do not auto-deploy. Redeploy with "Manual Deploy" in Render, or call the service's deploy hook (Render → Settings → Deploy Hook) after pushing.
