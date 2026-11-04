/* The Dhaaga Store: rotating hook display stand.
   Edit the product list here; everything else reads from it.
   hang = where the thread meets the toy, as a fraction of the 520x600 image height. */
const PRODUCTS = [
  { name: "Crabby",    img: "/assets/toys/crab.webp", hang: 0.1683,       alt: "Crabby, a blue crochet crab with heart-shaped claws" },
  { name: "Tiger Tot", img: "/assets/toys/tiger.webp", hang: 0.0383,      alt: "Tiger Tot, a yellow crochet tiger in green overalls" },
  { name: "Pengu",     img: "/assets/toys/penguin.webp", hang: 0.0117,    alt: "Pengu, a black and white crochet penguin with orange feet" },
  { name: "Scoop",     img: "/assets/toys/icecream.webp", hang: 0.0117,   alt: "Scoop, a pink crochet ice-cream cone" },
  { name: "Pupper",    img: "/assets/toys/puppy.webp", hang: 0.0117,      alt: "Pupper, a tan crochet puppy with floppy brown ears" },
  { name: "Bun Bun",   img: "/assets/toys/bunny.webp", hang: 0.285,      alt: "Bun Bun, a cream crochet bunny with a red bow" },
  { name: "Froggy",    img: "/assets/toys/frog.webp", hang: 0.1333,       alt: "Froggy, a round green crochet frog with a big smile" },
  { name: "Berry",     img: "/assets/toys/strawberry.webp", hang: 0.0117, alt: "Berry, a red crochet strawberry with a happy face" },
  { name: "Inky",      img: "/assets/toys/octopus.webp", hang: 0.0117,    alt: "Inky, a lavender crochet octopus with curly legs" },
  { name: "Buzz",      img: "/assets/toys/bee.webp", hang: 0.1583,        alt: "Buzz, a striped crochet bumblebee with white wings" },
];

(() => {
  const stand = document.getElementById("stand");
  const ring = document.getElementById("ring");
  const label = document.getElementById("toyLabel");
  if (!matchMedia("(hover: hover)").matches) document.getElementById("standHint").textContent = "Swipe to spin · tap a toy for a closer look";
  const hintHTML = label.innerHTML;
  const dialog = document.getElementById("toyDialog");
  const dImg = document.getElementById("dialogImg");
  const dName = document.getElementById("dialogName");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  const N = PRODUCTS.length, STEP = 360 / N;
  const AUTO_SPEED = 7;          // deg/s: one full turn every ~50 s
  const INTENT_MS = 80;          // hover intent delay (as in the reference rail)
  const RESUME_MS = 1400;        // auto-rotation resumes after a drag/hover ends

  const hanger = `<svg class="hanger" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true">
    <path d="M12 9 C12 3 18 1 19 6 C19.8 9.5 16 10 15.5 7" fill="none" stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    <line x1="12" y1="9" x2="12" y2="93" stroke="var(--maroon)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
  </svg>`;
  const ringSvg = `<svg width="12" height="12" viewBox="0 0 12 12" style="position:absolute;left:50%;top:calc(var(--thread) - 3px);margin-left:-6px" aria-hidden="true"><circle cx="6" cy="6" r="4.2" fill="none" stroke="var(--gold)" stroke-width="2"/><circle cx="4.6" cy="4.4" r="1" fill="var(--gold-hi)"/></svg>`;

  const items = PRODUCTS.map((p, i) => {
    const el = document.createElement("div");
    el.className = "item";
    el.style.setProperty("--sway-d", (2.6 + (i % 3) * 0.45).toFixed(2) + "s");
    el.style.setProperty("--sway-delay", (-i * 0.73).toFixed(2) + "s");
    el.style.setProperty("--sway-a", (2.4 + (i % 2) * 1.1).toFixed(1) + "deg");
    el.style.setProperty("--hang", p.hang ?? 0.0233);
    el.innerHTML = `<div class="swing">${hanger}${ringSvg}
      <button class="toy" type="button" data-i="${i}" aria-haspopup="dialog">
        <img src="${p.img}" alt="${p.alt}" width="520" height="600" decoding="async">
      </button></div>`;
    ring.appendChild(el);
    return { el, btn: el.querySelector(".toy"), back: null };
  });

  // ---------- state ----------
  let angle = 0, vel = 0, mode = "auto", target = 0, active = -1;
  let RX = 400, RZ = 160, last = 0, raf = 0, visible = true, resumeT = 0, intentT = 0, drag = null, suppressClick = 0;

  const norm = a => ((a % 360) + 540) % 360 - 180; // -> [-180,180)

  function measure() {
    // a wide oval rack: RX spans the stand, RZ gives depth
    const w = stand.clientWidth, toyW = items[0].btn.offsetWidth || 150;
    RX = Math.round(w < 600 ? w / 2 + toyW * 0.05 : Math.max(toyW * 0.8, Math.min(w / 2 - toyW * 0.42, 560)));
    RZ = Math.round(w < 600 ? toyW * 1.6 : Math.max(toyW * 1.05, Math.min(RX * 0.42, 240)));
    ring.style.setProperty("--RX", RX + "px");
    ring.style.setProperty("--RZ", RZ + "px");
  }

  function render() {
    ring.style.transform = `translateZ(${-RZ}px) rotateX(-8deg)`;
    let front = 0, best = -2;
    for (let i = 0; i < N; i++) {
      const t = (i * STEP + angle) * Math.PI / 180;
      const d = Math.cos(t);                                   // 1 = front, -1 = back
      const it = items[i];
      it.el.style.transform = `translate3d(${(RX * Math.sin(t)).toFixed(2)}px,0,${(RZ * d).toFixed(2)}px) rotateX(8deg)`;
      it.btn.style.opacity = (0.3 + 0.7 * (d + 1) / 2).toFixed(3);
      const back = d < -0.25;
      if (back !== it.back) { it.back = back; it.el.classList.toggle("is-back", back); }
      if (d > best) { best = d; front = i; }
    }
    return front;
  }

  function tick(t) {
    raf = 0;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
    if (mode === "auto") angle -= AUTO_SPEED * dt;
    else if (mode === "target") {
      // critically damped spring, keeps velocity on retarget (same idea as the reference's slideStep)
      const w = 9, x = norm(angle - target);
      const a = -w * w * x - 2 * w * vel;
      vel += a * dt; angle += vel * dt;
      if (Math.abs(x) < 0.05 && Math.abs(vel) < 0.05) { angle = target; vel = 0; mode = "hold"; }
    } else if (mode === "inertia") {
      angle += vel * dt; vel *= Math.pow(0.04, dt);
      if (Math.abs(vel) < 4) { mode = "hold"; scheduleResume(); }
    }
    render();
    if (mode !== "hold" && mode !== "drag" && visible && !reduce.matches) loop();
  }
  function loop() { if (!raf) raf = requestAnimationFrame(tick); }
  function wake() { last = 0; loop(); }

  function scheduleResume(ms = RESUME_MS) {
    clearTimeout(resumeT);
    resumeT = setTimeout(() => {
      if (dialog.open || drag || active >= 0) return;
      mode = "auto"; vel = 0; wake();
    }, ms);
  }

  function showLabel(i) {
    label.innerHTML = i < 0 ? hintHTML : `<b>${PRODUCTS[i].name}</b><span class="sep">—</span>Coming soon`;
  }
  function focusItem(i) {
    clearTimeout(resumeT);
    if (active === i) return;
    if (active >= 0) items[active].el.classList.remove("is-active");
    active = i;
    items[i].el.classList.add("is-active");
    showLabel(i);
    if (reduce.matches) return;
    // bring the toy to the front by the shortest way round
    target = angle + norm(-i * STEP - angle);
    mode = "target"; wake();
  }
  function release() {
    clearTimeout(intentT);
    if (active >= 0) items[active].el.classList.remove("is-active");
    active = -1; showLabel(-1);
    if (!reduce.matches) scheduleResume(600);
  }

  // ---------- hover (desktop) ----------
  items.forEach((it, i) => {
    it.btn.addEventListener("pointerenter", e => {
      if (e.pointerType !== "mouse" || drag) return;
      clearTimeout(intentT); intentT = setTimeout(() => focusItem(i), INTENT_MS);
    });
    it.btn.addEventListener("focus", () => focusItem(i));
    it.btn.addEventListener("blur", () => { if (!dialog.open) release(); });
    it.btn.addEventListener("click", e => {
      if (performance.now() < suppressClick) { e.preventDefault(); return; }
      openDialog(i);
    });
  });
  stand.addEventListener("pointerleave", e => { if (e.pointerType === "mouse" && !drag && !dialog.open) release(); });

  // ---------- swipe / drag ----------
  stand.addEventListener("pointerdown", e => {
    if (reduce.matches || e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), v: 0, h: false, a0: angle };
  });
  stand.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.h) {
      if (Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        drag.h = true; stand.setPointerCapture(e.pointerId); stand.classList.add("dragging");
        clearTimeout(resumeT); clearTimeout(intentT);
        if (active >= 0) { items[active].el.classList.remove("is-active"); active = -1; showLabel(-1); }
        mode = "drag"; drag.a0 = angle;
      } else return;
    }
    const k = 57.3 / RX;                            // degrees per px: the front toy follows the finger
    angle = drag.a0 + dx * k;
    const now = performance.now();
    drag.v = 0.7 * drag.v + 0.3 * ((e.clientX - drag.lx) * k) / Math.max(1, (now - drag.lt) / 1000);
    drag.lx = e.clientX; drag.lt = now;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); });
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; stand.classList.remove("dragging");
    if (!d.h) return;
    suppressClick = performance.now() + 350;
    if (stand.hasPointerCapture(e.pointerId)) stand.releasePointerCapture(e.pointerId);
    vel = Math.max(-400, Math.min(400, d.v)); mode = "inertia"; wake();
  }
  stand.addEventListener("pointerup", endDrag);
  stand.addEventListener("pointercancel", endDrag);

  // keyboard: arrows step the stand
  stand.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const cur = active >= 0 ? active : 0;
    const next = (cur + (e.key === "ArrowRight" ? 1 : N - 1)) % N;
    items[next].btn.focus();
  });

  // ---------- focused view ----------
  let lastFocus = null;
  function openDialog(i) {
    const p = PRODUCTS[i];
    lastFocus = items[i].btn;
    dImg.src = p.img; dImg.alt = p.alt; dName.textContent = p.name;
    clearTimeout(resumeT); mode = mode === "auto" ? "hold" : mode;
    dialog.showModal();
  }
  document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", e => {           // click outside the card closes
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (lastFocus) lastFocus.focus({ preventScroll: true });
    if (!finePointer.matches || !stand.matches(":hover")) release();
  });

  // ---------- lifecycle ----------
  function applyMotionPref() {
    stand.classList.toggle("static", reduce.matches);
    if (reduce.matches) { cancelAnimationFrame(raf); raf = 0; ring.style.transform = ""; items.forEach(it => { it.el.style.transform = ""; it.btn.style.opacity = ""; it.el.classList.remove("is-back"); }); }
    else { measure(); render(); mode = "auto"; wake(); }
  }
  reduce.addEventListener?.("change", applyMotionPref);
  addEventListener("resize", () => { if (!reduce.matches) { measure(); render(); } }, { passive: true });
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible && !reduce.matches) wake(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting && !document.hidden; if (visible && !reduce.matches) wake(); }).observe(stand);

  applyMotionPref();
})();
