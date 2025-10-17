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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOV7RjRU9fOPsutSOscgbj-gPD4e5Eh9uLmLU789XqxBzrGWkRzz0p6Ti4o908kt4o/exec'; // ← CAMBIA ESTO

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
            }
        });
        
        // Verificar si la respuesta es OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Obtener respuesta JSON
        const resultado = await response.json();
        
        console.log('✅ Respuesta del servidor:', resultado);
        
        if (resultado.success) {
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
            
        } else {
            // Error del servidor
            throw new Error(resultado.message || 'Error desconocido del servidor');
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

// Activar botón de beneficios
document.addEventListener('DOMContentLoaded', function() {
    const btnBenefits = document.getElementById('btnBenefits');
    if (btnBenefits) {
        btnBenefits.addEventListener('click', function() {
            openBenefitsModal();
        });
    }
});

/* ============================================
   MENÚ HAMBURGUESA - FUNCIONALIDAD DEFINITIVA
   ============================================ */

(function() {
    'use strict';
    
    // Esperar a que cargue el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
    
    function initMenu() {
        console.log('🔧 Inicializando menú hamburguesa...');
        
        // Seleccionar elementos
        const toggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('nav ul') || document.querySelector('.nav-menu');
        
        if (!toggle) {
            console.warn('⚠️ No se encontró el botón hamburguesa');
            return;
        }
        
        if (!menu) {
            console.warn('⚠️ No se encontró el menú');
            return;
        }
        
        console.log('✅ Elementos encontrados correctamente');
        
        // Toggle del menú
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = menu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        function openMenu() {
            menu.classList.add('active');
            toggle.classList.add('active');
            document.body.classList.add('menu-open');
            console.log('🟢 Menú abierto');
        }
        
        function closeMenu() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            console.log('🔴 Menú cerrado');
        }
        
        // Cerrar al hacer clic en enlaces
        const links = menu.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Si es un enlace ancla interno, cerrar menú
                if (this.getAttribute('href').startsWith('#')) {
                    setTimeout(closeMenu, 100);
                }
            });
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                if (menu.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
        
        // Cerrar al cambiar de móvil a desktop
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', function() {
            const currentWidth = window.innerWidth;
            if (lastWidth <= 768 && currentWidth > 768) {
                closeMenu();
            }
            lastWidth = currentWidth;
        });
        
        console.log('✅ Menú hamburguesa listo');
    }
})();