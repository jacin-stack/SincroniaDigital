// Animación de scroll tipo AOS (muy ligera)
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    const triggerBottom = window.innerHeight * 0.92;

    elements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            el.classList.add('aos-animate');
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Modales
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
// Cerrar modal al hacer click fuera del contenido
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal(modal.id);
    });
});

// Validación de formularios
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showMessage(form, msg, ok = false) {
    const messageDiv = form.querySelector('.form-message');
    messageDiv.textContent = msg;
    messageDiv.style.color = ok ? '#16a34a' : '#dc2626';
    messageDiv.style.marginTop = '1rem';
    if (ok) setTimeout(() => messageDiv.textContent = '', 3000);
}

// Formulario principal
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre = this.nombre.value.trim();
        const email = this.email.value.trim();
        const mensaje = this.mensaje.value.trim();

        if (!nombre || !email || !mensaje) {
            showMessage(this, 'Por favor, rellena todos los campos obligatorios.');
            return;
        }
        if (!validateEmail(email)) {
            showMessage(this, 'Introduce un correo electrónico válido.');
            return;
        }
        showMessage(this, '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', true);
        this.reset();
    });
}

// Formulario modal
const modalForm = document.getElementById('modal-contact-form');
if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre = this['modal-nombre'].value.trim();
        const email = this['modal-email'].value.trim();
        const mensaje = this['modal-mensaje'].value.trim();

        if (!nombre || !email || !mensaje) {
            showMessage(this, 'Por favor, rellena todos los campos obligatorios.');
            return;
        }
        if (!validateEmail(email)) {
            showMessage(this, 'Introduce un correo electrónico válido.');
            return;
        }
        showMessage(this, '¡Consulta enviada! Te contactaremos en menos de 24h.', true);
        this.reset();
    });
}

// Efecto de botón al hacer click
document.querySelectorAll('button, .btn-primary, .portfolio-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.97)');
    btn.addEventListener('mouseup', () => btn.style.transform = '');
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});