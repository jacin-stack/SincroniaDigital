# López & Co. — Web estática (sin back-end)

Landing page moderna en HTML/CSS/JS.

## Cómo verla

- Abre `index.html` con doble clic en tu navegador.

Si tu navegador bloquea alguna función por seguridad de archivos locales, usa un servidor estático:

### Opción A: Python (si lo tienes instalado)

```bash
python -m http.server 5173
```

Y abre `http://localhost:5173`.

### Opción B: Node (si lo tienes instalado)

```bash
npx serve .
```

## Contacto (sin servidor)

El contacto usa `mailto:` y abre el cliente de correo del usuario (sin back-end). También incluye copiar al portapapeles y un “mensaje rápido”.

- Cambia el email destino en `js/site.js`:
  - `CONTACT_TO_EMAIL = "hola@lopezco.com";`

