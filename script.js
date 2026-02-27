(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const progressBar = document.getElementById("scroll-progress-bar");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateScrollProgress() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
  }

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const interactiveEls = Array.from(document.querySelectorAll("[data-interactive]"));
  if (!prefersReducedMotion) {
    for (const el of interactiveEls) {
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        const rx = ((0.5 - y / rect.height) * 2.8).toFixed(2);
        const ry = (((x / rect.width) - 0.5) * 3.2).toFixed(2);
        el.style.setProperty("--mx", `${px}%`);
        el.style.setProperty("--my", `${py}%`);
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      });

      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    }
  }

  const focusCards = Array.from(document.querySelectorAll(".journey-card, .rail-card"));
  if (focusCards.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-active", entry.isIntersecting && entry.intersectionRatio > 0.5);
        }
      },
      { threshold: [0.5, 0.75], rootMargin: "-8% 0px -8% 0px" }
    );
    focusCards.forEach((card) => activeObserver.observe(card));
  }

  const rotatorEl = document.getElementById("hero-rotator-text");
  const metric1El = document.getElementById("hero-metric-1");
  const metric2El = document.getElementById("hero-metric-2");
  const metric3El = document.getElementById("hero-metric-3");
  const confidenceEl = document.getElementById("hero-confidence-value");
  const feedListEl = document.getElementById("hero-feed-list");
  const rotatorShell = rotatorEl ? rotatorEl.closest(".headline-rotator") : null;

  const heroRotations = [
    {
      focus: "Detection engineering for suspicious authentication activity",
      m1: "08m",
      m2: "05",
      m3: "NIST",
      confidence: "92%",
      feed: "Suspicious sign-in burst mapped to identity and VPN telemetry"
    },
    {
      focus: "Incident triage workflows aligned to operational response playbooks",
      m1: "11m",
      m2: "07",
      m3: "MITRE",
      confidence: "88%",
      feed: "Triage sequence updated with severity, scope, and escalation notes"
    },
    {
      focus: "Security metrics storytelling for dashboards and executive reporting",
      m1: "06m",
      m2: "04",
      m3: "SOC",
      confidence: "94%",
      feed: "Dashboard KPI panel refreshed after MFA control validation"
    }
  ];

  function heroFeedTimeStamp() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour12: false });
  }

  function pushHeroFeedLine(message) {
    if (!feedListEl) return;
    const li = document.createElement("li");
    const ts = document.createElement("span");
    ts.textContent = heroFeedTimeStamp();
    li.appendChild(ts);
    li.appendChild(document.createTextNode(message));
    feedListEl.prepend(li);
    while (feedListEl.children.length > 4) {
      feedListEl.removeChild(feedListEl.lastElementChild);
    }
  }

  if (rotatorEl && metric1El && metric2El && metric3El && confidenceEl && !prefersReducedMotion) {
    let heroRotationIndex = 0;
    window.setInterval(() => {
      heroRotationIndex = (heroRotationIndex + 1) % heroRotations.length;
      const next = heroRotations[heroRotationIndex];
      if (rotatorShell) rotatorShell.classList.add("is-switching");
      window.setTimeout(() => {
        rotatorEl.textContent = next.focus;
        metric1El.textContent = next.m1;
        metric2El.textContent = next.m2;
        metric3El.textContent = next.m3;
        confidenceEl.textContent = next.confidence;
        pushHeroFeedLine(next.feed);
        if (rotatorShell) rotatorShell.classList.remove("is-switching");
      }, 120);
    }, 3200);
  } else if (rotatorEl && metric1El && metric2El && metric3El && confidenceEl && prefersReducedMotion) {
    // Keep content static for reduced-motion users, but still ensure a consistent default state.
    const first = heroRotations[0];
    rotatorEl.textContent = first.focus;
    metric1El.textContent = first.m1;
    metric2El.textContent = first.m2;
    metric3El.textContent = first.m3;
    confidenceEl.textContent = first.confidence;
  }
})();
