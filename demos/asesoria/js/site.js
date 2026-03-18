const CONTACT_TO_EMAIL = "hola@lopezco.com";
// Si quieres WhatsApp, pon tu número en formato internacional, ejemplo: "34600111222"
const WHATSAPP_NUMBER = "";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setYear() {
  const y = String(new Date().getFullYear());
  $all("#year").forEach((n) => (n.textContent = y));
}

async function copyToClipboard(text) {
  const value = String(text ?? "");
  if (!value.trim()) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback para contextos donde clipboard API no está disponible
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

function encodeMailtoParam(value) {
  return encodeURIComponent(String(value ?? "").trim());
}

function buildMailto(subject, body) {
  return `mailto:${CONTACT_TO_EMAIL}?subject=${encodeMailtoParam(subject)}&body=${encodeMailtoParam(body)}`;
}

function initContactTargets() {
  const mailLink = $("#mailLink");
  const mailtoBtn = $("#mailtoBtn");
  const emailText = $("#emailText");

  if (mailLink && mailLink instanceof HTMLAnchorElement) {
    mailLink.href = `mailto:${CONTACT_TO_EMAIL}`;
    mailLink.textContent = CONTACT_TO_EMAIL;
  }
  if (mailtoBtn && mailtoBtn instanceof HTMLAnchorElement) {
    mailtoBtn.href = `mailto:${CONTACT_TO_EMAIL}`;
  }
  if (emailText) emailText.textContent = CONTACT_TO_EMAIL;

  const waBtn = $("#waBtn");
  if (waBtn && waBtn instanceof HTMLAnchorElement) {
    if (WHATSAPP_NUMBER.trim()) {
      waBtn.href = `https://wa.me/${WHATSAPP_NUMBER.trim()}`;
      waBtn.removeAttribute("aria-disabled");
    } else {
      waBtn.href = "#";
      waBtn.setAttribute("aria-disabled", "true");
    }
  }
}

function initDrawer() {
  const drawer = $("#contactDrawer");
  if (!drawer || !(drawer instanceof HTMLDialogElement)) return;

  const open = () => {
    if (!drawer.open) drawer.showModal();
    const msg = $("#quickMessage");
    if (msg && msg instanceof HTMLTextAreaElement) msg.focus();
  };

  $all("[data-open-contact]").forEach((btn) => btn.addEventListener("click", open));

  // Cerrar al hacer click fuera (en algunos navegadores)
  drawer.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target === drawer) drawer.close();
  });

  const status = $("#drawerStatus");
  const setStatus = (t) => {
    if (status) status.textContent = t;
  };

  $all("[data-copy-email]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const ok = await copyToClipboard(CONTACT_TO_EMAIL);
      setStatus(ok ? "Email copiado." : "No se pudo copiar el email.");
    }),
  );

  $all("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") ?? "";
      const ok = await copyToClipboard(text);
      setStatus(ok ? "Copiado al portapapeles." : "No se pudo copiar.");
    }),
  );

  const sendBtn = $("[data-send-email]");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const msg = $("#quickMessage");
      const message = msg && msg instanceof HTMLTextAreaElement ? msg.value.trim() : "";

      const subject = "Consulta — López & Co.";
      const body = [
        "Hola López & Co.,",
        "",
        message || "(Escribe aquí tu objetivo y situación)",
        "",
        "—",
        "Enviado desde la web",
      ].join("\n");

      window.location.href = buildMailto(subject, body);
      setStatus("Se ha abierto tu correo para enviar el mensaje.");
    });
  }

  const copyMsgBtn = $("[data-copy-message]");
  if (copyMsgBtn) {
    copyMsgBtn.addEventListener("click", async () => {
      const msg = $("#quickMessage");
      const text = msg && msg instanceof HTMLTextAreaElement ? msg.value.trim() : "";
      const ok = await copyToClipboard(text || "");
      setStatus(ok ? "Mensaje copiado." : "No se pudo copiar el mensaje.");
    });
  }
}

function initMobileNav() {
  const btn = $("[data-mobile-nav]");
  const nav = $("#mobileNav");
  if (!btn || !(btn instanceof HTMLButtonElement) || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  btn.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initScrollSpy() {
  const links = $all(".rail__link");
  if (!links.length) return;

  const byId = new Map();
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    if (id) byId.set(id, a);
  });

  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
      if (!visible || !(visible.target instanceof HTMLElement)) return;
      const id = visible.target.id;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const active = byId.get(id);
      if (active) active.setAttribute("aria-current", "true");
    },
    { root: null, threshold: [0.25, 0.45, 0.6] },
  );

  sections.forEach((s) => io.observe(s));
}

function initSwitcher() {
  $all("[data-switcher]").forEach((root) => {
    const tabs = $all("[data-tab]", root);
    const panels = $all(".panel", root);
    if (!tabs.length || !panels.length) return;

    const activate = (key) => {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-tab") === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-key") === key));
    };

    tabs.forEach((t) => {
      t.addEventListener("click", () => activate(t.getAttribute("data-tab")));
    });
  });
}

setYear();
initContactTargets();
initDrawer();
initMobileNav();
initScrollSpy();
initSwitcher();

