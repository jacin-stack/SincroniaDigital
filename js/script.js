// Animaciones de scroll (AOS simple)
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            el.classList.add('aos-animate');
        }
    });
}

// Ejecutar animaciones al cargar y al hacer scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Navegación móvil
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cerrar modal al hacer click fuera del contenido
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Cerrar modal con Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Validación de formularios
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone);
}

function showMessage(form, message, isSuccess = false) {
    const messageDiv = form.querySelector('.form-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${isSuccess ? 'success' : 'error'}`;

        if (isSuccess) {
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }, 5000);
        }
    }
}

// Función para enviar email usando Spring Boot backend
async function sendEmail(formData) {
    try {
        const response = await fetch('http://localhost:8081/api/contact/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: formData.get('nombre') || formData.get('modal-nombre'),
                email: formData.get('email') || formData.get('modal-email'),
                telefono: formData.get('telefono') || null,
                servicio: formData.get('servicio') || null,
                mensaje: formData.get('mensaje') || formData.get('modal-mensaje')
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error enviando email:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Formulario principal de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const nombre = formData.get('nombre').trim();
        const email = formData.get('email').trim();
        const telefono = formData.get('telefono').trim();
        const servicio = formData.get('servicio');
        const mensaje = formData.get('mensaje').trim();

        // Validaciones
        if (!nombre || !email || !mensaje) {
            showMessage(this, 'Por favor, rellena todos los campos obligatorios.');
            return;
        }

        if (nombre.length < 2) {
            showMessage(this, 'El nombre debe tener al menos 2 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            showMessage(this, 'Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (telefono && !validatePhone(telefono)) {
            showMessage(this, 'Por favor, introduce un número de teléfono válido.');
            return;
        }

        if (!servicio) {
            showMessage(this, 'Por favor, selecciona un servicio.');
            return;
        }

        if (mensaje.length < 10) {
            showMessage(this, 'El mensaje debe tener al menos 10 caracteres.');
            return;
        }

        // Mostrar indicador de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Enviar email
        const result = await sendEmail(formData);

        if (result.success) {
            showMessage(this, '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo en menos de 24 horas.', true);
            this.reset();
        } else {
            showMessage(this, result.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        }

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Formulario modal
const modalContactForm = document.getElementById('modal-contact-form');
if (modalContactForm) {
    modalContactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const nombre = formData.get('modal-nombre').trim();
        const email = formData.get('modal-email').trim();
        const mensaje = formData.get('modal-mensaje').trim();

        // Validaciones
        if (!nombre || !email || !mensaje) {
            showMessage(this, 'Por favor, rellena todos los campos obligatorios.');
            return;
        }

        if (nombre.length < 2) {
            showMessage(this, 'El nombre debe tener al menos 2 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            showMessage(this, 'Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (mensaje.length < 10) {
            showMessage(this, 'El mensaje debe tener al menos 10 caracteres.');
            return;
        }

        // Mostrar indicador de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Enviar email
        const result = await sendEmail(formData);

        if (result.success) {
            showMessage(this, '¡Consulta enviada! Te contactaremos en menos de 24 horas.', true);
            this.reset();
            setTimeout(() => {
                closeModal('contact-modal');
            }, 2000);
        } else {
            showMessage(this, result.message || 'Error al enviar la consulta. Por favor, inténtalo de nuevo.');
        }

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Efectos de botones
document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.98)';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.transform = '';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Efectos hover en tarjetas
document.querySelectorAll('.service-card, .portfolio-item, .step, .tech-item').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = this.style.transform || '';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// Contador de estadísticas (opcional)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Lazy loading para imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header con efecto de transparencia al hacer scroll
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(30, 41, 59, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
            header.style.backdropFilter = 'none';
        }
    }
}

window.addEventListener('scroll', handleHeaderScroll);

// Preloader (opcional)
window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Tooltips para tecnologías
document.querySelectorAll('.tech-item').forEach(item => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = item.querySelector('span').textContent;
    tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 1000;
        transform: translateY(10px);
    `;

    item.style.position = 'relative';
    item.appendChild(tooltip);

    item.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    });

    item.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(10px)';
    });
});

// Efecto de escritura para el título principal (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Efecto de escritura en el título principal (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !heroTitle.textContent.includes('Digitalizamos')) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }

    // Añadir clase active al enlace de navegación actual
    const currentSection = window.location.hash || '#inicio';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});

// Detectar sección activa al hacer scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink); 