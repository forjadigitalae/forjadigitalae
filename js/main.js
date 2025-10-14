/* ================================
   FORJADIGITALAE - MAIN.JS
   JavaScript Optimizado - VERSIÓN FINAL CORREGIDA
   ================================ */

// ===== GESTIÓN DE COOKIES =====
function showCookieNotice() {
    const hasConsent = localStorage.getItem('forja_cookie_consent');
    if (!hasConsent) {
        const overlay = document.getElementById('cookieOverlay');
        const notice = document.getElementById('cookieNotice');
        if (overlay && notice) {
            overlay.style.display = 'block';
            notice.style.display = 'block';
        }
    }
}

function acceptCookies() {
    localStorage.setItem('forja_cookie_consent', 'accepted');
    hideCookieNotice();
    trackEvent('cookie_consent', { action: 'accepted' });
}

function rejectCookies() {
    localStorage.setItem('forja_cookie_consent', 'rejected');
    hideCookieNotice();
    trackEvent('cookie_consent', { action: 'rejected' });
}

function hideCookieNotice() {
    const overlay = document.getElementById('cookieOverlay');
    const notice = document.getElementById('cookieNotice');
    if (overlay) overlay.style.display = 'none';
    if (notice) notice.style.display = 'none';
}

// ===== PRELOADER =====
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                setTimeout(showCookieNotice, 1000);
            }, 500);
        }, 1500);
    }
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== SMOOTH SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Validar que el href no está vacío y no es solo "#"
            if (!href || href === '#' || href.length <= 1) {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Cerrar menú móvil si está abierto
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = document.querySelector('.mobile-menu-toggle i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Inicializar observer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        observer.observe(el);
    });
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
});

// ===== NÚMEROS ANIMADOS EN HERO =====
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const targetText = number.innerText;
        const target = parseInt(targetText);
        
        // Si no es un número válido, salir
        if (isNaN(target)) return;
        
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                number.innerText = targetText;
                clearInterval(timer);
            } else {
                const suffix = targetText.includes('%') ? '%' : '';
                number.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Observer para activar animación de números cuando hero sea visible
const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateNumbers, 2000);
            heroObserver.unobserve(entry.target);
        }
    });
});

// Inicializar hero observer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});


/* ==================================================
   ===== GESTIÓN DE MODALES Y FORMULARIO (CORREGIDO)
   ================================================== */

// Funciones para el Modal de Contacto Principal
function openContactForm() {
    document.getElementById('contactFormModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeContactForm() {
    document.getElementById('contactFormModal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
    document.getElementById('contactForm').reset();
}

// Funciones para el Mensaje de Éxito
function closeSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// Funciones para la Política de Privacidad (¡LA CLAVE CORREGIDA!)
function showPrivacyPolicy() {
    document.getElementById('privacyPolicyModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePrivacyPolicy() {
    document.getElementById('privacyPolicyModal').style.display = 'none';
    
    // Restaurar el scroll del body solo si ningún otro modal de pantalla completa está abierto
    if (document.getElementById('contactFormModal').style.display !== 'flex' && 
        document.getElementById('successMessage').style.display !== 'block') {
        document.body.style.overflow = 'auto';
    }
}

// ===== MODAL GESTIÓN DE DATOS =====
function showDataPolicy() {
    document.getElementById('dataPolicyModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDataPolicy() {
    document.getElementById('dataPolicyModal').style.display = 'none';
    
    // Restaurar scroll si no hay otros modales abiertos
    if (document.getElementById('contactFormModal').style.display !== 'flex' && 
        document.getElementById('privacyPolicyModal').style.display !== 'flex' &&
        document.getElementById('successMessage').style.display !== 'block') {
        document.body.style.overflow = 'auto';
    }
}

// ===== MODAL COOKIES =====
function showCookiesPolicy() {
    document.getElementById('cookiesPolicyModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCookiesPolicy() {
    document.getElementById('cookiesPolicyModal').style.display = 'none';
    
    // Restaurar scroll si no hay otros modales abiertos
    if (document.getElementById('contactFormModal').style.display !== 'flex' && 
        document.getElementById('privacyPolicyModal').style.display !== 'flex' &&
        document.getElementById('successMessage').style.display !== 'block') {
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modales al hacer clic fuera
document.addEventListener('DOMContentLoaded', function() {
    const dataPolicyModal = document.getElementById('dataPolicyModal');
    if (dataPolicyModal) {
        dataPolicyModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDataPolicy();
            }
        });
    }

    const cookiesModal = document.getElementById('cookiesPolicyModal');
    if (cookiesModal) {
        cookiesModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCookiesPolicy();
            }
        });
    }
});


// Manejar envío del formulario (Captura y procesamiento de nuevos campos)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // 1. Procesamiento de FormData para capturar todos los campos, incluyendo selección múltiple
            const desafios = [];
            for (let [key, value] of formData.entries()) {
                if (key === 'desafio') {
                    desafios.push(value);
                } else if (key !== 'nombre' && key !== 'apellido') { // Omitir campos que no existen en el nuevo HTML
                    data[key] = value;
                }
            }
            data.desafio = desafios.join(', '); // Cadena con desafíos separados por coma
            
            // 2. Validación de términos
            if (!data.terminos) {
                alert('Debes aceptar los términos y condiciones');
                return;
            }
            
            // 3. Simulación de Envío / Integración (Aquí iría tu llamada FETCH/AJAX a Google Sheets)
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            console.log('✅ Data lista para Google Sheets (POST):', data);
            trackEvent('form_submission', {
                company: data.empresa,
                contact_email: data.email
            });
            
            // Simular delay de envío
            setTimeout(() => {
                closeContactForm();
                closeSuccessMessage(); // Asegurar que no esté visible
                const successMsg = document.getElementById('successMessage');
                if (successMsg) successMsg.style.display = 'flex'; // Usar flex para mostrar el modal

                // Restaurar botón
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ENVIAR SOLICITUD';
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Listener para cerrar Modales al hacer clic fuera del contenido
    const contactModal = document.getElementById('contactFormModal');
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactForm();
            }
        });
    }

    const privacyModal = document.getElementById('privacyPolicyModal');
    if (privacyModal) {
        privacyModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePrivacyPolicy();
            }
        });
    }

    const successModal = document.getElementById('successMessage');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessMessage();
            }
        });
    }
});


// ===== ANALYTICS TRACKING (Mantenido) =====
function trackEvent(eventName, properties = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log para debugging
    console.log(`📊 Event tracked: ${eventName}`, properties);
}

// Tracking de clicks en CTAs
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-cta-primary, .cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.innerText.trim();
            const sectionElement = this.closest('section');
            const buttonLocation = sectionElement ? sectionElement.className : 'unknown';
            
            trackEvent('cta_click', {
                button_text: buttonText,
                button_location: buttonLocation
            });
        });
    });
});

// Tracking de tiempo en página
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', { seconds: timeSpent });
});

// ===== PREVENCIÓN DE ERRORES (Mantenido) =====
window.addEventListener('error', function(e) {
    console.error('❌ Error detectado:', e.error);
});

// ===== MODAL BENEFICIOS EVALUACIÓN =====
function openBenefitsModal() {
    document.getElementById('benefitsModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBenefitsModal() {
    document.getElementById('benefitsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar al hacer clic fuera del contenido
document.addEventListener('DOMContentLoaded', function() {
    const benefitsModal = document.getElementById('benefitsModal');
    if (benefitsModal) {
        benefitsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBenefitsModal();
            }
        });
    }
});

// ===== LOG DE INICIALIZACIÓN (Mantenido) =====
console.log('%c🚀 ForjaDigitalAE inicializado correctamente', 'color: #4CCED5; font-size: 16px; font-weight: bold;');
console.log('%c📊 Versión: 3.0 - Modales Corregidos', 'color: #EE8028; font-size: 12px;');

// Activar botón de beneficios
document.addEventListener('DOMContentLoaded', function() {
    const btnBenefits = document.getElementById('btnBenefits');
    if (btnBenefits) {
        btnBenefits.addEventListener('click', function() {
            openBenefitsModal();
        });
    }
});