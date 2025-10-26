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
const header = document.getElementById('main-header');
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


// ===== CONFIGURACIÓN DEL FORMULARIO - CONEXIÓN CON GOOGLE SHEETS =====
// URL del script de Google Sheets (mismo que usa la evaluación)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOV7RjRU9fOPsutSOscgbj-gPD4e5Eh9uLmLU789XqxBzrGWkRzz0p6Ti4o908kt4o/exec';

// Manejar envío del formulario
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validar términos
    const terminosCheckbox = this.querySelector('input[name="terminos"]');
    if (!terminosCheckbox || !terminosCheckbox.checked) {
        alert('❌ Debes aceptar la Política de Privacidad para continuar');
        return;
    }
    
    // Obtener el botón de envío
    const submitBtn = this.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn.innerHTML;
    
    // Cambiar estado del botón
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
       try {
        // Preparar datos del formulario
        const formData = new FormData(this);
        
        // PROCESAR CHECKBOXES DE DESAFÍOS (CRÍTICO PARA MÚLTIPLES SELECCIONES)
        const desafiosSeleccionados = [];
        const checkboxes = this.querySelectorAll('input[name="desafio"]:checked');
        checkboxes.forEach((checkbox, index) => {
            desafiosSeleccionados.push(checkbox.value);
        });
        
        console.log('📋 Desafíos seleccionados:', desafiosSeleccionados);
        console.log('📊 Total de desafíos:', desafiosSeleccionados.length);
        
        // Agregar campos adicionales
        formData.append('fecha_aceptacion', new Date().toISOString());
        formData.append('acepta_politicas', 'Sí');
        formData.append('origen', 'Formulario Principal');
        
        // IMPORTANTE: Eliminar los desafíos individuales y agregar todos juntos
        formData.delete('desafio');
        
        // Agregar cada desafío con un índice único
        desafiosSeleccionados.forEach((desafio, index) => {
            formData.append(`desafio_${index}`, desafio);
        });
        
        // También agregar el total como un solo campo (para compatibilidad)
        if (desafiosSeleccionados.length > 0) {
            formData.append('desafios_total', desafiosSeleccionados.join(' | '));
        }
        
        // Convertir FormData a URLSearchParams
        const datos = new URLSearchParams(formData);
        
        // Log para debugging
        console.log('📤 Datos que se enviarán:', Array.from(datos.entries()));
        
        console.log('📤 Enviando datos al servidor...');
        
        // Enviar a Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: datos,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            mode: 'no-cors' // Importante para evitar errores CORS
        });
        
        // Debido a mode: 'no-cors', no podemos verificar la respuesta
        // Asumimos éxito si no hay error en el fetch
        console.log('✅ Datos enviados correctamente');
        
        // Éxito - cerrar formulario y mostrar mensaje
        closeContactForm();
        document.getElementById('successMessage').style.display = 'flex';
        
        // Limpiar formulario
        this.reset();
        
        // Tracking de evento (si tienes analytics configurado)
        if (typeof trackEvent === 'function') {
            trackEvent('Formulario_Enviado', {
                empresa: formData.get('empresa'),
                sector: formData.get('sector')
            });
        }
        
    } catch (error) {
        // Manejo de errores
        console.error('❌ Error al enviar formulario:', error);
        
        // Mostrar mensaje de error al usuario
        alert('❌ Hubo un error al enviar el formulario. Por favor, intenta nuevamente o contáctanos directamente por WhatsApp: +57 314 236 5590');
        
        // Tracking de error (si tienes analytics)
        if (typeof trackEvent === 'function') {
            trackEvent('Formulario_Error', {
                error: error.message
            });
        }
        
    } finally {
        // Restaurar botón (siempre se ejecuta)
        submitBtn.innerHTML = textoOriginal;
        submitBtn.disabled = false;
    }
});

// Log de inicialización
console.log('✅ Script de formulario cargado - Versión con Google Sheets');


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

// ===== MENÚ MÓVIL - TOGGLE HAMBURGUESA =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar propagación
            
            // Toggle del menú
            navMenu.classList.toggle('active');
            
            // Cambiar icono hamburguesa/cerrar
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Bloquear scroll
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = 'auto';
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Cerrar menú al cambiar orientación/resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

console.log('✅ Menú móvil inicializado correctamente');

// Activar botón de beneficios
document.addEventListener('DOMContentLoaded', function() {
    const btnBenefits = document.getElementById('btnBenefits');
    if (btnBenefits) {
        btnBenefits.addEventListener('click', function() {
            openBenefitsModal();
        });
    }
});