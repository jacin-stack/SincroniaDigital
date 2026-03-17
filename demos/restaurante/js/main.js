/* Interacciones ligeras (sin back-end) */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Año en footer
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Header elevación al hacer scroll
  const header = document.querySelector("[data-elevate-on-scroll]");
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-elevated", window.scrollY > 6);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menú móvil
  const nav = $("#site-nav");
  const toggle = $(".nav-toggle");
  const setExpanded = (expanded) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    nav.classList.toggle("is-open", expanded);
  };
  const isExpanded = () => toggle?.getAttribute("aria-expanded") === "true";

  if (toggle && nav) {
    toggle.addEventListener("click", () => setExpanded(!isExpanded()));

    // Cerrar al pulsar un enlace
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setExpanded(false);
    });

    // Cerrar con Escape o click fuera
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });
    document.addEventListener("click", (e) => {
      if (!isExpanded()) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (nav.contains(target) || toggle.contains(target)) return;
      setExpanded(false);
    });
  }

  // Resaltar sección activa en navegación
  const navLinks = $$(".site-nav a.nav-link");
  const sectionIds = navLinks
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && h.startsWith("#") && h.length > 1)
    .map((h) => h.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        const id = visible.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
      },
      { root: null, threshold: [0.2, 0.35, 0.5] }
    );
    sections.forEach((s) => obs.observe(s));
  }

  // Filtrado de carta
  const chips = $$("[data-filter]");
  const menu = $("[data-menu]");
  if (chips.length && menu) {
    const items = $$(".menu-item", menu);
    const setActiveChip = (chip) => {
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-selected", active ? "true" : "false");
      });
    };
    const applyFilter = (filter) => {
      items.forEach((it) => {
        const cat = it.getAttribute("data-category") || "";
        const show = filter === "todo" || cat === filter;
        it.classList.toggle("is-hidden", !show);
      });
    };
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter") || "todo";
        setActiveChip(chip);
        applyFilter(filter);
      });
    });
  }

  // Toast simple
  const toast = $(".toast");
  const toastTitle = $("[data-toast-title]");
  const toastText = $("[data-toast-text]");
  const toastClose = $(".toast-close");
  let toastTimer = null;

  const showToast = ({ title, text }) => {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastText) toastText.textContent = text;
    toast.hidden = false;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    requestAnimationFrame(() => {
      toast.style.transition = "opacity .18s ease, transform .18s ease";
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(hideToast, 5200);
  };

  const hideToast = () => {
    if (!toast) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    window.setTimeout(() => {
      toast.hidden = true;
    }, 200);
  };

  if (toastClose) toastClose.addEventListener("click", hideToast);

  // Formulario reservas (simulación)
  const form = $("[data-reserva-form]");
  if (form) {
    const fecha = $("#fecha", form);
    if (fecha && fecha instanceof HTMLInputElement && !fecha.value) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      fecha.value = `${yyyy}-${mm}-${dd}`;
      fecha.min = fecha.value;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const personas = String(data.get("personas") || "").trim();
      const f = String(data.get("fecha") || "").trim();
      const h = String(data.get("hora") || "").trim();

      const ok = nombre && personas && f && h;
      if (!ok) {
        showToast({
          title: "Revisa el formulario",
          text: "Por favor, completa los campos obligatorios para simular la reserva.",
        });
        return;
      }

      showToast({
        title: "Reserva confirmada (simulación)",
        text: `¡Gracias, ${nombre}! Mesa para ${personas} el ${f} a las ${h}.`,
      });
      form.reset();
    });
  }
})();

