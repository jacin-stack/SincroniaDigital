(() => {
  const qs = (sel, parent = document) => parent.querySelector(sel);
  const qsa = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  const header = qs("[data-header]");
  const nav = qs("[data-nav]");
  const navToggle = qs("[data-nav-toggle]");

  const setYear = () => {
    const el = qs("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  };

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  const initNav = () => {
    if (!nav || !navToggle) return;

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeNav();
      else openNav();
    });

    qsa("a[href^='#']", nav).forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(target) || navToggle.contains(target)) return;
      closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  };

  const initSmoothScroll = () => {
    const links = qsa("a[href^='#']:not([href='#'])");
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href) return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();

        const headerH = header ? header.getBoundingClientRect().height : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });

        history.pushState(null, "", `#${id}`);
      });
    });
  };

  const initGalleryModal = () => {
    const gallery = qs("[data-gallery]");
    const modal = qs("[data-modal]");
    const modalImg = qs("[data-modal-img]");
    const closers = qsa("[data-modal-close]");

    if (!gallery || !modal || !modalImg) return;

    const open = (src, alt) => {
      modalImg.src = src;
      modalImg.alt = alt || "Imagen";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      modal.setAttribute("aria-hidden", "true");
      modalImg.src = "";
      modalImg.alt = "";
      document.body.style.overflow = "";
    };

    gallery.addEventListener("click", (e) => {
      const btn = e.target instanceof Element ? e.target.closest("[data-img]") : null;
      if (!btn) return;

      const src = btn.getAttribute("data-img") || "";
      const alt = btn.getAttribute("data-alt") || "";
      open(src, alt);
    });

    closers.forEach((el) => el.addEventListener("click", () => close()));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
    });
  };

  const initBookingForm = () => {
    const form = qs("[data-booking-form]");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const telefono = String(data.get("telefono") || "").trim();
      const servicio = String(data.get("servicio") || "").trim();
      const preferencia = String(data.get("preferencia") || "").trim();
      const mensaje = String(data.get("mensaje") || "").trim();

      if (!nombre || !telefono || !servicio || !preferencia) {
        alert("Por favor, completa los campos obligatorios (nombre, teléfono, servicio y preferencia).");
        return;
      }

      const resumen =
        `Hola, soy ${nombre}. ` +
        `Quiero pedir cita para: ${servicio}. ` +
        `Mi teléfono: ${telefono}. ` +
        (mensaje ? `Detalles: ${mensaje}` : "");

      const encoded = encodeURIComponent(resumen);

      if (preferencia === "whatsapp") {
        // Número demo del salón en el HTML. Puedes cambiarlo aquí también si quieres.
        const salon = "34910000000";
        window.open(`https://wa.me/${salon}?text=${encoded}`, "_blank", "noopener,noreferrer");
        return;
      }

      if (preferencia === "email") {
        const email = "hola@peluqueria-aurora.example";
        const subject = encodeURIComponent("Solicitud de cita - Peluquería Aurora");
        window.location.href = `mailto:${email}?subject=${subject}&body=${encoded}`;
        return;
      }

      alert(
        "Perfecto. Te recomendamos llamar al salón para confirmar la cita.\n\n" +
          "Resumen preparado:\n" +
          resumen
      );
    });
  };

  setYear();
  initNav();
  initSmoothScroll();
  initGalleryModal();
  initBookingForm();
})();

