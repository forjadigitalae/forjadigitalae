/* ================================
   FORJADIGITALAE - EVALUACIÓN JS
   Versión Optimizada y Modular
   ================================ */

// ===== CONFIGURACIÓN GLOBAL =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxV6oR9z1Px-YnlbZXR-rJ04Kz-6g7A6DLMDGwg9E460EGuBnS2X5TEcScXtXN0zCrVqA/exec';

// ===== ESTADO DE LA APLICACIÓN =====
let appState = {
    currentSection: 'landing',
    companyData: {},
    evaluationData: {
        currentCategory: 0,
        currentQuestion: 0,
        answers: {},
        categoryScores: {}
    },
    consent: {
        essential: true,
        communications: false,
        benchmarking: false
    }
};

// ===== CATEGORÍAS DE EVALUACIÓN =====
const categories = [
    {
        id: 'vision_estrategia',
        name: 'Visión y Estrategia',
        icon: '🎯',
        weight: 0.10,
        description: 'Se evalúa si la empresa tiene una visión clara a largo plazo y una estrategia bien definida para alcanzarla.',
        questions: [
            { id: 've_01', text: '¿La empresa tiene una visión a largo plazo, formalmente documentada y comunicada a todo el equipo?', tooltip: 'La visión debe ser un documento escrito, conocido y entendido por todos.', weight: 1.2 },
            { id: 've_02', text: '¿Existe un plan estratégico claro que detalle los objetivos, metas y acciones para los próximos 3-5 años?', tooltip: 'El plan debe incluir KPIs para medir el progreso.', weight: 1.2 },
            { id: 've_03', text: '¿La estrategia de la empresa considera activamente las tendencias del mercado y el entorno competitivo?', tooltip: 'Se deben realizar análisis periódicos del mercado.', weight: 1.0 },
            { id: 've_04', text: '¿Los objetivos de los departamentos y empleados están claramente alineados con la estrategia general?', tooltip: 'La estrategia debe desglosarse en objetivos específicos para cada área.', weight: 1.1 },
            { id: 've_05', text: '¿Se asignan recursos de manera coherente con las prioridades estratégicas?', tooltip: 'El presupuesto debe reflejar las prioridades estratégicas.', weight: 1.1 }
        ]
    },
    {
        id: 'gobierno_empresarial',
        name: 'Gobierno Empresarial',
        icon: '🏛️',
        weight: 0.10,
        description: 'Analiza la solidez de las estructuras de toma de decisiones y los procesos de control.',
        questions: [
            { id: 'ge_01', text: '¿Existen roles y responsabilidades claramente definidos para los líderes?', tooltip: 'Debe haber un organigrama claro.', weight: 1.2 },
            { id: 'ge_02', text: '¿La empresa cuenta con políticas y procedimientos internos documentados?', tooltip: 'Las políticas escritas garantizan consistencia.', weight: 1.1 },
            { id: 'ge_03', text: '¿Se realizan reuniones de seguimiento periódicas para revisar el desempeño?', tooltip: 'Deben existir comités estructurados.', weight: 1.0 },
            { id: 'ge_04', text: '¿Existe un proceso formal para la gestión de riesgos?', tooltip: 'La gestión de riesgos debe ser proactiva.', weight: 1.2 },
            { id: 'ge_05', text: '¿Hay mecanismos de control interno y auditoría?', tooltip: 'Se deben realizar auditorías periódicas.', weight: 1.0 }
        ]
    },
    {
        id: 'procesos_operaciones',
        name: 'Procesos y Operaciones',
        icon: '⚙️',
        weight: 0.10,
        description: 'Mide la eficiencia y estandarización de los flujos de trabajo clave.',
        questions: [
            { id: 'po_01', text: '¿Los procesos clave del negocio están documentados y estandarizados?', tooltip: 'Procesos mapeados permiten operación consistente.', weight: 1.2 },
            { id: 'po_02', text: '¿Se utilizan herramientas tecnológicas para automatizar tareas repetitivas?', tooltip: 'La automatización libera tiempo del personal.', weight: 1.1 },
            { id: 'po_03', text: '¿Se miden y monitorean regularmente los indicadores de rendimiento de los procesos?', tooltip: 'Lo que no se mide no se puede mejorar.', weight: 1.1 },
            { id: 'po_04', text: '¿Existe una cultura de mejora continua?', tooltip: 'Los equipos deben buscar formas de optimizar.', weight: 1.0 },
            { id: 'po_05', text: '¿Los diferentes sistemas están integrados?', tooltip: 'Los sistemas deben "hablar" entre sí.', weight: 1.2 }
        ]
    },
    {
        id: 'talento_cultura',
        name: 'Gestión de Talento',
        icon: '👥',
        weight: 0.10,
        description: 'Evalúa si la cultura fomenta la colaboración y el desarrollo continuo.',
        questions: [
            { id: 'tc_01', text: '¿La empresa tiene un proceso estructurado para atraer y retener talento?', tooltip: 'Incluye planes de carrera y beneficios.', weight: 1.1 },
            { id: 'tc_02', text: '¿Se invierte en programas de capacitación y desarrollo?', tooltip: 'El desarrollo de competencias es clave.', weight: 1.2 },
            { id: 'tc_03', text: '¿La cultura organizacional promueve la colaboración?', tooltip: 'Una cultura saludable fomenta el trabajo en equipo.', weight: 1.0 },
            { id: 'tc_04', text: '¿Se realizan evaluaciones de desempeño periódicas?', tooltip: 'Las evaluaciones deben alinearse con objetivos.', weight: 1.0 },
            { id: 'tc_05', text: '¿El liderazgo inspira y modela los valores deseados?', tooltip: 'Los líderes son el motor de la cultura.', weight: 1.3 }
        ]
    },
    {
        id: 'innovacion_agilidad',
        name: 'Innovación y Agilidad',
        icon: '💡',
        weight: 0.10,
        description: 'Analiza la capacidad de adaptarse rápidamente a los cambios del mercado.',
        questions: [
            { id: 'ia_01', text: '¿La empresa dedica tiempo y recursos para explorar nuevas ideas?', tooltip: 'La innovación requiere inversión intencional.', weight: 1.2 },
            { id: 'ia_02', text: '¿Se fomenta la experimentación y se aceptan los fracasos?', tooltip: 'Una cultura que castiga el error inhibe innovación.', weight: 1.1 },
            { id: 'ia_03', text: '¿La empresa es capaz de tomar decisiones y ajustar su rumbo rápidamente?', tooltip: 'La agilidad evita burocracia excesiva.', weight: 1.1 },
            { id: 'ia_04', text: '¿Se monitorean activamente las tecnologías emergentes?', tooltip: 'Tener un "radar" tecnológico es vital.', weight: 1.0 },
            { id: 'ia_05', text: '¿Se colabora con clientes o proveedores para co-crear?', tooltip: 'Las alianzas aceleran la innovación.', weight: 1.0 }
        ]
    },
    {
        id: 'estrategia_tecnologica',
        name: 'Estrategia Tecnológica',
        icon: '💻',
        weight: 0.10,
        description: 'Evalúa si la tecnología está alineada con los objetivos y es escalable.',
        questions: [
            { id: 'et_01', text: '¿La infraestructura tecnológica actual soporta las necesidades del negocio?', tooltip: 'La tecnología debe ser un habilitador.', weight: 1.1 },
            { id: 'et_02', text: '¿Existe un roadmap tecnológico que guíe las inversiones?', tooltip: 'Las decisiones tecnológicas no deben ser improvisadas.', weight: 1.2 },
            { id: 'et_03', text: '¿La arquitectura tecnológica es escalable?', tooltip: 'Los sistemas deben poder crecer.', weight: 1.1 },
            { id: 'et_04', text: '¿Se cuenta con políticas robustas de ciberseguridad?', tooltip: 'Incluye antivirus, firewalls y capacitación.', weight: 1.3 },
            { id: 'et_05', text: '¿Se evalúa el ROI de las iniciativas tecnológicas?', tooltip: 'La tecnología es una inversión medible.', weight: 1.0 }
        ]
    },
    {
        id: 'inteligencia_negocio',
        name: 'Inteligencia de Negocio',
        icon: '📊',
        weight: 0.10,
        description: 'Examina cómo la empresa utiliza datos para tomar decisiones.',
        questions: [
            { id: 'in_01', text: '¿La empresa recopila sistemáticamente datos de operaciones y clientes?', tooltip: 'Procesos definidos para capturar datos.', weight: 1.1 },
            { id: 'in_02', text: '¿Los datos se almacenan de forma centralizada y organizada?', tooltip: 'Una "única fuente de verdad" es crucial.', weight: 1.2 },
            { id: 'in_03', text: '¿Se utilizan herramientas de visualización de datos?', tooltip: 'Dashboards muestran rendimiento en tiempo real.', weight: 1.1 },
            { id: 'in_04', text: '¿Las decisiones se respaldan con análisis de datos?', tooltip: 'Cultura de decisiones basadas en evidencia.', weight: 1.3 },
            { id: 'in_05', text: '¿El personal tiene habilidades básicas para interpretar datos?', tooltip: 'Alfabetización de datos es esencial.', weight: 1.0 }
        ]
    },
    {
        id: 'experiencia_cliente',
        name: 'Experiencia del Cliente',
        icon: '🧡',
        weight: 0.10,
        description: 'Mide la satisfacción del cliente y analiza los puntos de contacto.',
        questions: [
            { id: 'cx_01', text: '¿Se mide de forma sistemática la satisfacción del cliente?', tooltip: 'Método constante para escuchar al cliente.', weight: 1.2 },
            { id: 'cx_02', text: '¿Se han mapeado los "viajes del cliente"?', tooltip: 'Identificar momentos de fricción.', weight: 1.1 },
            { id: 'cx_03', text: '¿Se utiliza la retroalimentación para implementar mejoras?', tooltip: 'Actuar sobre el feedback del cliente.', weight: 1.3 },
            { id: 'cx_04', text: '¿La experiencia es consistente a través de todos los canales?', tooltip: 'Mismo nivel de servicio en todos los puntos.', weight: 1.0 },
            { id: 'cx_05', text: '¿Se personaliza la comunicación para diferentes segmentos?', tooltip: 'Experiencia relevante aumenta lealtad.', weight: 1.0 }
        ]
    },
    {
        id: 'sostenibilidad_responsabilidad',
        name: 'Sostenibilidad',
        icon: '🌍',
        weight: 0.10,
        description: 'Evalúa el compromiso con prácticas de impacto positivo.',
        questions: [
            { id: 'sr_01', text: '¿La empresa tiene una política de sostenibilidad definida?', tooltip: 'Compromiso formal en materia social y ambiental.', weight: 1.1 },
            { id: 'sr_02', text: '¿Se han implementado prácticas para reducir el impacto ambiental?', tooltip: 'Acciones concretas de sostenibilidad.', weight: 1.0 },
            { id: 'sr_03', text: '¿La empresa participa en iniciativas sociales?', tooltip: 'Apoyo a la comunidad local.', weight: 1.0 },
            { id: 'sr_04', text: '¿Se consideran criterios éticos al seleccionar proveedores?', tooltip: 'Responsabilidad en la cadena de suministro.', weight: 1.2 },
            { id: 'sr_05', text: '¿Se comunican de forma transparente las acciones de sostenibilidad?', tooltip: 'Transparencia genera confianza.', weight: 1.1 }
        ]
    },
    {
        id: 'finanzas_rentabilidad',
        name: 'Finanzas',
        icon: '💰',
        weight: 0.10,
        description: 'Analiza la gestión financiera y capacidad de generar rentabilidad.',
        questions: [
            { id: 'fr_01', text: '¿Se elabora un presupuesto anual detallado?', tooltip: 'Presupuesto es herramienta de control fundamental.', weight: 1.2 },
            { id: 'fr_02', text: '¿Se monitorea de cerca el flujo de caja?', tooltip: 'Gestión proactiva del cash flow.', weight: 1.3 },
            { id: 'fr_03', text: '¿Se analizan regularmente los estados financieros?', tooltip: 'Entender rentabilidad para decisiones.', weight: 1.1 },
            { id: 'fr_04', text: '¿Existen políticas claras para la gestión de costos?', tooltip: 'Control de costos constante.', weight: 1.0 },
            { id: 'fr_05', text: '¿La empresa tiene un plan financiero a largo plazo?', tooltip: 'Proyectar necesidades de capital.', weight: 1.1 }
        ]
    }
];

const scaleLabels = [
    'Muy Bajo / No aplica',
    'Bajo / Iniciando',
    'Medio / En desarrollo',
    'Alto / Bien implementado',
    'Muy Alto / Excelente'
];

const scaleColors = ['#AA2F0C', '#EC8E48', '#EE8028', '#4CCED5', '#10b981'];

// ===== FUNCIONES DE UI =====
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    const currentSection = document.getElementById(sectionId);
    if (currentSection) currentSection.classList.remove('hidden');
    
    appState.currentSection = sectionId;
    window.scrollTo(0, 0);

    if (sectionId !== 'landing') {
        document.body.style.background = 'var(--primary-50)';
        document.body.classList.add('section-view');
    } else {
        document.body.style.background = 'var(--azul-marino)';
        document.body.classList.remove('section-view');
    }
}

function resetApp() {
    localStorage.removeItem('pymeEvaluationState');
    location.reload();
}

function showPrivacyPolicy() {
    document.getElementById('privacyPolicyModal').classList.remove('hidden');
}

function hidePrivacyPolicy() {
    document.getElementById('privacyPolicyModal').classList.add('hidden');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function showLoading(message = 'Procesando...') {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    if (loader && loaderText) {
        loaderText.textContent = message;
        loader.classList.remove('hidden');
    }
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// ===== FUNCIONES DE REGISTRO =====
function validateForm() {
    const requiredFields = [
        { id: 'companyName', name: 'Nombre de la empresa' },
        { id: 'companySector', name: 'Sector económico' },
        { id: 'companySize', name: 'Número de empleados' },
        { id: 'companyYears', name: 'Años en operación' },
        { id: 'companyLocation', name: 'Ubicación' },
        { id: 'contactName', name: 'Nombre del contacto' },
        { id: 'contactEmail', name: 'Email corporativo' },
        { id: 'contactPhone', name: 'Teléfono' },
        { id: 'contactRole', name: 'Cargo' }
    ];

    const missingFields = [];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            missingFields.push(field.name);
        }
    });

    // Validar email
    const email = document.getElementById('contactEmail')?.value;
    if (email && !isValidEmail(email)) {
        missingFields.push('Email con formato válido');
    }

    return missingFields;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleRegistration(e) {
    e.preventDefault();
    
    // Validar formulario
    const missingFields = validateForm();
    if (missingFields.length > 0) {
        showToast(`Por favor completa: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    showLoading('Guardando información...');
    
    // Obtener datos del formulario
    const formData = new FormData(e.target);
    
    appState.companyData = {
        name: document.getElementById('companyName')?.value || formData.get('companyName'),
        sector: document.getElementById('companySector')?.value || formData.get('sector'),
        size: document.getElementById('companySize')?.value || formData.get('size'),
        years: document.getElementById('companyYears')?.value || formData.get('years'),
        location: document.getElementById('companyLocation')?.value || formData.get('location'),
        city: document.getElementById('companyLocation')?.value?.split(',')[0] || 'N/A',
        website: document.getElementById('companyWebsite')?.value || formData.get('website'),
        contactName: document.getElementById('contactName')?.value || formData.get('contactName'),
        email: document.getElementById('contactEmail')?.value || formData.get('email'),
        phone: document.getElementById('contactPhone')?.value || formData.get('phone'),
        role: document.getElementById('contactRole')?.value || formData.get('role')
    };
    
    setTimeout(() => {
        autoSave();
        hideLoading();
        showToast('✅ Información guardada correctamente', 'success');
        showSection('evaluation');
        initEvaluation();
    }, 1000);
}

// ===== FUNCIONES DE EVALUACIÓN =====
function getCurrentQuestion() {
    const category = categories[appState.evaluationData.currentCategory];
    if (!category || !category.questions) return null;
    const question = category.questions[appState.evaluationData.currentQuestion];
    return question;
}

function initEvaluation() {
    appState.evaluationData.currentCategory = 0;
    appState.evaluationData.currentQuestion = 0;
    renderCategoryProgress();
    renderCurrentQuestion();
}

function renderCategoryProgress() {
    const container = document.getElementById('categoryProgress');
    if (!container) return;
    
    container.innerHTML = categories.map((cat, idx) => {
        const completedQuestions = cat.questions.filter(q => 
            appState.evaluationData.answers[q.id] !== undefined
        ).length;
        
        const isCompleted = completedQuestions === cat.questions.length;
        const isCurrent = idx === appState.evaluationData.currentCategory;
        
        return `
            <div class="category-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                <div class="category-icon">${cat.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${cat.name}</div>
                    <div style="font-size: 0.875rem; opacity: 0.7;">
                        ${completedQuestions}/${cat.questions.length} preguntas
                    </div>
                </div>
                ${isCompleted ? '<span style="color: var(--success-500);">✓</span>' : ''}
            </div>
        `;
    }).join('');
    
    // Actualizar progreso general
    updateOverallProgress();
}

function updateOverallProgress() {
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredQuestions = Object.keys(appState.evaluationData.answers).length;
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.getElementById('progressText');
    const overallProgress = document.getElementById('overallProgress');
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
    
    if (progressText) {
        const completedCategories = categories.filter(cat => 
            cat.questions.every(q => appState.evaluationData.answers[q.id] !== undefined)
        ).length;
        progressText.textContent = `${completedCategories} de ${categories.length} categorías`;
    }
    
    if (overallProgress) {
        overallProgress.style.setProperty('--score', percentage);
    }
}

function updateGlobalProgress() {
    // Calcular total de preguntas respondidas
    let totalAnswered = 0;
    let totalQuestions = 0;
    
    categories.forEach(cat => {
        totalQuestions += cat.questions.length;
        cat.questions.forEach(q => {
            if (appState.evaluationData.answers[q.id] !== null && appState.evaluationData.answers[q.id] !== undefined) {
                totalAnswered++;
            }
        });
    });
    
    const percentage = Math.round((totalAnswered / totalQuestions) * 100);
    
    // Actualizar elementos del DOM
    const currentEl = document.getElementById('globalProgressCurrent');
    const totalEl = document.getElementById('globalProgressTotal');
    const percentageEl = document.getElementById('globalProgressPercentage');
    const fillEl = document.getElementById('globalProgressFill');
    
    if (currentEl) currentEl.textContent = totalAnswered;
    if (totalEl) totalEl.textContent = totalQuestions;
    if (percentageEl) percentageEl.textContent = percentage;
    
    if (fillEl) {
        // Agregar clase para animación de "bump"
        fillEl.classList.add('progress-bump');
        setTimeout(() => fillEl.classList.remove('progress-bump'), 600);
        
        // Actualizar ancho con animación
        fillEl.style.width = `${percentage}%`;
        
        // Celebración al llegar al 100%
        if (percentage === 100) {
            celebrateCompletion();
        }
    }
}

// Función de celebración al completar 100%
function celebrateCompletion() {
    // Crear efecto de confetti (opcional - requiere librería canvas-confetti)
    // Si no quieres instalar librería, comenta esta parte
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    // Mostrar mensaje de felicitación
    showToast('🎉 ¡Felicitaciones! Has completado todas las preguntas', 'success');
}

function renderCurrentQuestion() {
    const category = categories[appState.evaluationData.currentCategory];
    const question = category.questions[appState.evaluationData.currentQuestion];
    
    // Actualizar información de categoría
    const categoryBadge = document.getElementById('categoryBadge');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const tooltipText = document.getElementById('tooltipText');
    
    if (categoryBadge) {
        categoryBadge.textContent = `${category.icon} ${category.name}`;
    }
    
    if (categoryTitle) {
        categoryTitle.textContent = category.name;
    }
    
    if (categoryDescription) {
        categoryDescription.textContent = category.description;
    }
    
    if (questionNumber) {
        questionNumber.textContent = `Pregunta ${appState.evaluationData.currentQuestion + 1} de ${category.questions.length}`;
    }
    
    if (questionText) {
        questionText.textContent = question.text;
    }
    
    if (tooltipText) {
        tooltipText.textContent = question.tooltip;
    }
    
    // Actualizar barra de progreso de la categoría
    updateCategoryProgressBar();
    
    // Renderizar opciones de escala
    renderScaleOptionsImproved();
    
    // Actualizar botones de navegación
    updateNavigationButtons();
}

function updateCategoryProgressBar() {
    const category = categories[appState.evaluationData.currentCategory];
    const progress = ((appState.evaluationData.currentQuestion + 1) / category.questions.length) * 100;
    const progressBar = document.getElementById('categoryProgressBar');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function renderScaleOptionsImproved() {
    const scaleOptionsContainer = document.getElementById('scaleOptions');
    if (!scaleOptionsContainer) return;
    
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    // Definir emojis y descripciones para cada nivel
    const optionData = [
        {
            value: 0,
            emoji: '😟',
            label: 'Muy Bajo / No aplica',
            description: 'No existe o no se implementa'
        },
        {
            value: 1,
            emoji: '😐',
            label: 'Bajo / Iniciando',
            description: 'En etapa muy temprana o informal'
        },
        {
            value: 2,
            emoji: '🙂',
            label: 'Medio / En desarrollo',
            description: 'Parcialmente implementado'
        },
        {
            value: 3,
            emoji: '😊',
            label: 'Alto / Bien implementado',
            description: 'Bien establecido y funcional'
        },
        {
            value: 4,
            emoji: '🌟',
            label: 'Muy Alto / Excelente',
            description: 'Optimizado y en mejora continua'
        }
    ];
    
    // Limpiar contenedor
    scaleOptionsContainer.innerHTML = '';
    
    // Crear opciones mejoradas
    optionData.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'scale-option';
        optionCard.setAttribute('data-value', option.value);
        
        // Marcar como seleccionada si corresponde
        if (appState.evaluationData.answers[currentQuestion.id] === option.value) {
            optionCard.classList.add('selected');
        }
        
        optionCard.innerHTML = `
            <div class="option-icon">${option.emoji}</div>
            <div class="option-number">${option.value}</div>
            <div class="option-label">${option.label}</div>
            <div class="option-description">${option.description}</div>
        `;
        
        // Event listener con animación
        optionCard.addEventListener('click', function() {
            selectOptionImproved(option.value, this);
        });
        
        scaleOptionsContainer.appendChild(optionCard);
    });
}

// Función mejorada para seleccionar opción
function selectOptionImproved(value, element) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    // Guardar respuesta en el estado global
    appState.evaluationData.answers[currentQuestion.id] = value;
    
    // Remover selección anterior
    document.querySelectorAll('.scale-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Agregar selección a la nueva opción
    element.classList.add('selected');
    
    // Mostrar feedback visual
    showFeedbackMessage(value);
    
    // Habilitar botón siguiente
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
    
    // Actualizar progreso global y de categoría
    if (typeof updateGlobalProgress === 'function') {
        updateGlobalProgress();
    }
    if (typeof renderCategoryProgress === 'function') {
        renderCategoryProgress();
    }
    
    // Guardar en localStorage (optimizado)
    debouncedAutoSave();
    
    // Auto-avanzar después de 1 segundo (opcional)
    // Descomentar si quieres que avance automáticamente:
    // setTimeout(() => {
    //     if (nextBtn && !nextBtn.disabled) {
    //         nextBtn.click();
    //     }
    // }, 1000);
}

// Función para mostrar mensaje de feedback
function showFeedbackMessage(value) {
    const feedbackContainer = document.getElementById('selectedFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (!feedbackContainer || !feedbackMessage) return;
    
    const messages = {
        0: { text: '😟 Has seleccionado: Muy Bajo / No aplica', color: '#ef4444' },
        1: { text: '😐 Has seleccionado: Bajo / Iniciando', color: '#f97316' },
        2: { text: '🙂 Has seleccionado: Medio / En desarrollo', color: '#eab308' },
        3: { text: '😊 Has seleccionado: Alto / Bien implementado', color: '#3b82f6' },
        4: { text: '🌟 Has seleccionado: Muy Alto / Excelente', color: '#10b981' }
    };
    
    const message = messages[value];
    
    feedbackMessage.textContent = message.text;
    feedbackMessage.style.color = message.color;
    feedbackMessage.style.fontWeight = '600';
    
    feedbackContainer.classList.remove('hidden');
    
    // Animación de entrada
    feedbackContainer.style.animation = 'none';
    setTimeout(() => {
        feedbackContainer.style.animation = 'slideInUp 0.4s ease';
    }, 10);
}


function showAnswerFeedback(answerValue) {
    const feedbackContainer = document.getElementById('selectedFeedback');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (!feedbackContainer || !feedbackMessage) return;
    
    if (answerValue !== null && answerValue !== undefined) {
        feedbackContainer.classList.remove('hidden');
        feedbackMessage.innerHTML = `
            <span style="color: ${scaleColors[answerValue]}; font-weight: 600;">
                ✅ Has seleccionado: ${scaleLabels[answerValue]}
            </span>
        `;
        feedbackMessage.style.backgroundColor = `${scaleColors[answerValue]}20`;
        feedbackMessage.style.padding = '1rem';
        feedbackMessage.style.borderRadius = '0.5rem';
    } else {
        feedbackContainer.classList.add('hidden');
    }
}

function getAnswerValue(questionId) {
    return appState.evaluationData.answers[questionId] !== undefined 
        ? appState.evaluationData.answers[questionId] 
        : null;
}

function selectAnswer(questionId, value) {
    appState.evaluationData.answers[questionId] = value;
    autoSave();
    renderCurrentQuestion();
    updateGlobalProgress();
}

function updateNavigationButtons() {
    // Intentar con ambos IDs por compatibilidad
    const btnPrev = document.getElementById('prevBtn');
    const btnNext = document.getElementById('nextBtn');
    
    if (btnPrev) {
        const isFirstQuestion = appState.evaluationData.currentCategory === 0 && 
                               appState.evaluationData.currentQuestion === 0;
        btnPrev.disabled = isFirstQuestion;
    }
    
    if (btnNext) {
        const category = categories[appState.evaluationData.currentCategory];
        const question = category.questions[appState.evaluationData.currentQuestion];
        const isAnswered = appState.evaluationData.answers[question.id] !== null && appState.evaluationData.answers[question.id] !== undefined;
        
        btnNext.disabled = !isAnswered;
        
        // Cambiar texto del botón en la última pregunta
        const isLastQuestion = appState.evaluationData.currentCategory === categories.length - 1 &&
                              appState.evaluationData.currentQuestion === category.questions.length - 1;
        
        if (isLastQuestion) {
            btnNext.innerHTML = '✅ Finalizar Evaluación';
        } else {
            btnNext.innerHTML = 'Siguiente →';
        }
    }
}

function previousQuestion() {
    if (appState.evaluationData.currentQuestion > 0) {
        appState.evaluationData.currentQuestion--;
    } else if (appState.evaluationData.currentCategory > 0) {
        appState.evaluationData.currentCategory--;
        appState.evaluationData.currentQuestion = 
            categories[appState.evaluationData.currentCategory].questions.length - 1;
    }
    
    renderCategoryProgress();
    renderCurrentQuestion();
    debouncedAutoSave();
    updateGlobalProgress();
}

function nextQuestion() {
    const category = categories[appState.evaluationData.currentCategory];
    
    if (appState.evaluationData.currentQuestion < category.questions.length - 1) {
        appState.evaluationData.currentQuestion++;
    } else if (appState.evaluationData.currentCategory < categories.length - 1) {
        appState.evaluationData.currentCategory++;
        appState.evaluationData.currentQuestion = 0;
    } else {
        finishEvaluation();
        return;
    }
    
    renderCategoryProgress();
    renderCurrentQuestion();
    debouncedAutoSave();
    updateGlobalProgress();
}

// ===== FINALIZACIÓN Y RESULTADOS =====
function finishEvaluation() {
    showLoading('Calculando resultados...');
    
    setTimeout(() => {
        calculateScores();
        sendDataToGoogleSheets();
        showSection('results');
        renderResults();
        hideLoading();
    }, 1500);
}

function calculateScores() {
    categories.forEach(category => {
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        category.questions.forEach(question => {
            const answer = appState.evaluationData.answers[question.id] || 0;
            const normalizedScore = (answer / 4) * 100;
            totalWeightedScore += normalizedScore * question.weight;
            totalWeight += question.weight;
        });
        
        appState.evaluationData.categoryScores[category.id] = 
            Math.round(totalWeightedScore / totalWeight);
    });
    
    const totalScore = Object.values(appState.evaluationData.categoryScores)
        .reduce((sum, score) => sum + score, 0) / categories.length;
    
    appState.evaluationData.totalScore = Math.round(totalScore);
    appState.evaluationData.maturityLevel = getMaturityLevel(totalScore);
    
    autoSave();
}

function getMaturityLevel(score) {
    if (score < 20) return { level: 'Inicial', description: 'Requiere atención urgente' };
    if (score < 40) return { level: 'En Desarrollo', description: 'Grandes oportunidades de mejora' };
    if (score < 60) return { level: 'Intermedio', description: 'Progreso sólido, continuar fortaleciendo' };
    if (score < 80) return { level: 'Avanzado', description: 'Buen nivel, optimizar para excelencia' };
    return { level: 'Líder', description: 'Excelente desempeño' };
}

function renderResults() {
    const totalScore = appState.evaluationData.totalScore || 0;
    const maturityLevel = appState.evaluationData.maturityLevel || { level: 'N/A', description: 'Sin datos' };
    const categoryScores = appState.evaluationData.categoryScores || {};
    
    // Actualizar score principal
    const finalScoreNumber = document.getElementById('finalScoreNumber');
    const finalScoreCircle = document.getElementById('finalScore');
    const maturityBadge = document.getElementById('maturityBadge');
    const maturityDescription = document.getElementById('maturityDescription');
    
    if (finalScoreNumber) {
        finalScoreNumber.textContent = totalScore;
    }
    
    if (finalScoreCircle) {
        finalScoreCircle.style.setProperty('--score', totalScore);
    }
    
    if (maturityBadge) {
        maturityBadge.textContent = maturityLevel.level;
        maturityBadge.className = 'maturity-badge';
    }
    
    if (maturityDescription) {
        maturityDescription.textContent = maturityLevel.description;
    }
    
    // Renderizar gráfico radar
    renderRadarChart();
    
    // Renderizar resultados detallados
    renderDetailedResults();
    
    // Renderizar recomendaciones
    renderRecommendations();
}

function renderRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const categoryScores = appState.evaluationData.categoryScores || {};
    
    // Destruir chart anterior si existe
    if (window.radarChartInstance) {
        window.radarChartInstance.destroy();
    }
    
    const labels = categories.map(cat => cat.name);
    const data = categories.map(cat => categoryScores[cat.id] || 0);
    
    window.radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tu Puntuación',
                data: data,
                backgroundColor: 'rgba(133, 96, 192, 0.2)',
                borderColor: 'rgba(133, 96, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(133, 96, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(133, 96, 192, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderDetailedResults() {
    const container = document.getElementById('detailedResults');
    if (!container) return;
    
    const categoryScores = appState.evaluationData.categoryScores || {};
    
    container.innerHTML = categories.map(cat => {
        const score = categoryScores[cat.id] || 0;
        const scoreColor = getScoreColor(score);
        const scoreDesc = getScoreDescription(score);
        
        return `
            <div class="category-result-card">
                <div class="category-result-header">
                    <span class="category-result-icon">${cat.icon}</span>
                    <h3 class="category-result-title">${cat.name}</h3>
                    <span class="category-result-score" style="color: ${scoreColor}">${score}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${score}%; background-color: ${scoreColor}"></div>
                </div>
                <p class="category-result-description">${scoreDesc}</p>
            </div>
        `;
    }).join('');
}

function renderRecommendations() {
    const recommendations = generateRecommendations();
    const container = document.getElementById('recommendations');
    
    container.innerHTML = recommendations.map((rec, idx) => {
        const priorityClass = `priority-${rec.priority.toLowerCase().replace('í', 'i')}`;
        return `
        <div class="recommendation-card ${priorityClass}">
            <div class="recommendation-header">
                <span class="priority-badge">${rec.priority}</span>
                <span class="category-icon">${rec.categoryIcon}</span>
            </div>
            <h3>${rec.title}</h3>
            <p class="recommendation-description">${rec.description}</p>
        </div>
    `}).join('');
}

function generateRecommendations() {
    const categoryScores = appState.evaluationData.categoryScores || {};
    const sortedCategories = categories
        .map(cat => ({ ...cat, score: categoryScores[cat.id] || 0 }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);

    const recs = {
        'vision_estrategia': {
            title: 'Fortalecer Visión Estratégica',
            description: 'Un puntaje bajo aquí sugiere que la empresa podría carecer de un rumbo claro y unificado. Esto puede generar desalineación entre equipos y dificultar la toma de decisiones a largo plazo. Es crucial definir un futuro inspirador y comunicarlo eficazmente.',
            priority: 'CRÍTICO',
            actions: ['Documentar una visión y misión claras y ambiciosas.', 'Desarrollar un plan estratégico a 3-5 años con objetivos medibles (KPIs).', 'Asegurar que cada miembro del equipo entienda cómo su rol contribuye a la visión.']
        },
        'gobierno_empresarial': {
            title: 'Estructurar Gobierno Corporativo',
            description: 'Una estructura de gobierno débil puede llevar a decisiones lentas, falta de rendición de cuentas y dependencia excesiva en los fundadores. Formalizar roles y procesos es clave para la escalabilidad y la toma de decisiones ágil.',
            priority: 'ALTO',
            actions: ['Crear un organigrama claro con roles y responsabilidades definidos.', 'Documentar políticas y procedimientos clave para estandarizar operaciones.', 'Establecer un comité de dirección con reuniones periódicas para el seguimiento estratégico.']
        },
        'procesos_operaciones': {
            title: 'Optimizar Procesos y Operaciones',
            description: 'Procesos ineficientes o manuales son un freno para el crecimiento. Mapear, estandarizar y automatizar los flujos de trabajo clave liberará recursos y reducirá errores, mejorando la capacidad operativa.',
            priority: 'ALTO',
            actions: ['Mapear los 5 procesos de negocio más críticos (ej. ventas, entrega).', 'Identificar cuellos de botella y oportunidades de automatización.', 'Implementar una herramienta de gestión de procesos (BPM) o un ERP simple.']
        },
        'talento_cultura': {
            title: 'Impulsar la Gestión de Talento',
            description: 'El éxito de la empresa reside en su gente. Un puntaje bajo aquí indica una necesidad de invertir en el desarrollo, motivación y retención del equipo para construir una cultura de alto desempeño.',
            priority: 'MEDIO',
            actions: ['Diseñar un plan de capacitación y desarrollo profesional.', 'Implementar un sistema de evaluación de desempeño justo y periódico.', 'Lanzar iniciativas para fomentar la colaboración y el feedback.']
        },
        'innovacion_agilidad': {
            title: 'Fomentar la Innovación y Agilidad',
            description: 'La incapacidad para adaptarse rápidamente es un riesgo en el mercado actual. Es vital crear un entorno donde se premie la experimentación y la empresa pueda responder con agilidad a los cambios.',
            priority: 'MEDIO',
            actions: ['Asignar un pequeño presupuesto para proyectos de innovación.', 'Crear un programa de intraemprendimiento para que surjan nuevas ideas.', 'Adoptar metodologías ágiles (como Scrum o Kanban) en equipos clave.']
        },
        'estrategia_tecnologica': {
            title: 'Definir una Estrategia Tecnológica Clara',
            description: 'La tecnología debe ser un habilitador, no un obstáculo. Es fundamental alinear las inversiones tecnológicas con los objetivos del negocio y asegurar que la infraestructura sea escalable y segura.',
            priority: 'ALTO',
            actions: ['Realizar una auditoría del estado tecnológico actual.', 'Crear un roadmap de tecnología alineado a la estrategia de negocio.', 'Fortalecer las políticas y herramientas de ciberseguridad.']
        },
        'inteligencia_negocio': {
            title: 'Desarrollar la Inteligencia de Negocio',
            description: 'Tomar decisiones basadas en intuición es arriesgado. Es momento de transformar los datos en un activo estratégico, implementando herramientas y una cultura que priorice la evidencia para decidir.',
            priority: 'MEDIO',
            actions: ['Implementar una herramienta de Business Intelligence (BI) como Power BI o Looker Studio.', 'Definir y monitorear los 5-10 KPIs más importantes del negocio.', 'Capacitar al equipo directivo en interpretación y uso de datos.']
        },
        'experiencia_cliente': {
            title: 'Mejorar la Experiencia del Cliente (CX)',
            description: 'Un cliente satisfecho es tu mejor vendedor. Un puntaje bajo aquí es una alerta para poner al cliente en el centro, entendiendo su viaje y eliminando fricciones para aumentar la lealtad.',
            priority: 'ALTO',
            actions: ['Implementar un sistema para medir la satisfacción del cliente (ej. NPS).', 'Mapear el "customer journey" para identificar puntos de dolor.', 'Crear un protocolo de atención al cliente unificado para todos los canales.']
        },
        'sostenibilidad_responsabilidad': {
            title: 'Integrar la Sostenibilidad y RSC',
            description: 'Las empresas modernas deben generar un impacto positivo. Definir una estrategia de Responsabilidad Social Corporativa (RSC) no solo mejora la reputación, sino que también atrae talento y clientes.',
            priority: 'BAJO',
            actions: ['Definir una política de RSC alineada a los valores de la empresa.', 'Lanzar un programa de reducción de impacto ambiental (ej. reciclaje).', 'Establecer una alianza con una causa social local.']
        },
        'finanzas_rentabilidad': {
            title: 'Fortalecer la Gestión Financiera',
            description: 'La salud financiera es la base de todo. Un control deficiente del flujo de caja y la rentabilidad es un riesgo crítico. Es urgente implementar herramientas y procesos para una gestión robusta.',
            priority: 'CRÍTICO',
            actions: ['Implementar un software contable o financiero en la nube.', 'Establecer un proceso de presupuesto mensual y anual.', 'Realizar un análisis de rentabilidad por producto/servicio.']
        }
    };
    
    return sortedCategories.map(category => {
        const rec = recs[category.id] || recs['vision_estrategia'];
        return {
            ...rec,
            category: category.name,
            categoryIcon: category.icon,
            score: category.score
        };
    });
}

function getScoreColor(score) {
    if (score <= 20) return '#AA2F0C';
    if (score <= 40) return '#EC8E48';
    if (score <= 60) return '#EE8028';
    if (score <= 80) return '#4CCED5';
    return '#10b981';
}

function getScoreDescription(score) {
    if (score <= 20) return 'Área crítica que requiere atención inmediata';
    if (score <= 40) return 'Oportunidad de mejora significativa';
    if (score <= 60) return 'Progreso intermedio, continuar fortaleciendo';
    if (score <= 80) return 'Buen nivel, optimizar para excelencia';
    return 'Excelente desempeño, mantener liderazgo';
}

// ===== ENVÍO A GOOGLE SHEETS =====
async function sendDataToGoogleSheets() {
    try {
        // Validar que tenemos datos mínimos
        if (!appState.companyData.name || !appState.companyData.email) {
            console.warn('⚠️ Datos de empresa incompletos, no se enviarán a Google Sheets');
            return;
        }

        const payload = {
            timestamp: new Date().toISOString(),
            companyData: appState.companyData,
            evaluationData: {
                totalScore: appState.evaluationData.totalScore || 0,
                maturityLevel: appState.evaluationData.maturityLevel || { level: 'N/A', description: 'Sin datos' },
                categoryScores: appState.evaluationData.categoryScores || {},
                answers: appState.evaluationData.answers || {}
            },
            consent: appState.consent
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('✅ Datos enviados a Google Sheets');
    } catch (error) {
        console.error('❌ Error enviando datos:', error);
        // No mostrar error al usuario para no interrumpir la experiencia
    }
}

// ===== FUNCIONES AUXILIARES =====
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function autoSave() {
    try {
        // Sanitizar datos antes de guardar
        const sanitizedState = {
            ...appState,
            companyData: {
                ...appState.companyData,
                // Sanitizar campos de texto
                name: sanitizeText(appState.companyData.name),
                contactName: sanitizeText(appState.companyData.contactName),
                email: sanitizeEmail(appState.companyData.email),
                phone: sanitizePhone(appState.companyData.phone)
            }
        };
        
        localStorage.setItem('pymeEvaluationState', JSON.stringify(sanitizedState));
    } catch (error) {
        console.error('❌ Error guardando estado:', error);
    }
}

function sanitizeText(text) {
    if (!text) return '';
    return text.trim().substring(0, 200); // Limitar longitud
}

function sanitizeEmail(email) {
    if (!email) return '';
    return email.trim().toLowerCase();
}

function sanitizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/[^\d+\-\s()]/g, ''); // Solo números y caracteres de teléfono
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('pymeEvaluationState');
        if (saved) {
            const savedState = JSON.parse(saved);
            
            // Validar estructura básica del estado guardado
            if (savedState && typeof savedState === 'object') {
                savedState.consent = appState.consent;
                appState = { ...appState, ...savedState };
                
                if (appState.currentSection && appState.currentSection !== 'landing') {
                    showSection(appState.currentSection);
                    if (appState.currentSection === 'evaluation') {
                        renderCategoryProgress();
                        renderCurrentQuestion();
                    } else if (appState.currentSection === 'results') {
                        renderResults();
                    }
                }
            }
            console.log('✅ Estado guardado cargado correctamente');
        }
    } catch (error) {
        console.error('❌ Error cargando estado guardado:', error);
        // Limpiar estado corrupto
        localStorage.removeItem('pymeEvaluationState');
        showToast('Se reinició la evaluación debido a un error', 'error');
    }
}

// ===== GENERACIÓN DE PDF - VERSIÓN FINAL CORREGIDA =====
async function downloadPDF() {
    showLoading('Generando tu reporte profesional...');
    
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) throw new Error('jsPDF no disponible');
        
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 50;
        const contentWidth = pageWidth - (2 * margin);
        
        // Colores corporativos
        const colors = {
            primary: [39, 50, 90],
            purple: [133, 96, 192],
            turquoise: [76, 206, 213],
            orange: [238, 128, 40],
            gray: [107, 114, 128],
            lightGray: [248, 250, 252],
            white: [255, 255, 255],
            green: [16, 185, 129]
        };
        
        // Datos
        const companyData = appState.companyData || {};
        const evaluationData = appState.evaluationData || {};
        const finalScore = evaluationData.totalScore || 0;
        const maturityLevel = evaluationData.maturityLevel || { level: 'N/A', description: 'Sin datos' };
        const categoryScores = evaluationData.categoryScores || {};
        
        // CORRECCIÓN 1: Función para cargar logo manteniendo proporción
        async function loadLogo() {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const aspectRatio = img.width / img.height;
                    const targetWidth = 400;
                    const targetHeight = targetWidth / aspectRatio;
                    
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    resolve({
                        data: canvas.toDataURL('image/png'),
                        aspectRatio: aspectRatio
                    });
                };
                img.onerror = () => resolve(null);
                img.src = 'https://forjadigitalae.github.io/LOGO%20F_OSC.png';
            });
        }
        
        const logoInfo = await loadLogo();
        
        // ========== PÁGINA 1: PORTADA ==========
        
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 100, 'F');
        
        // Logo con proporción correcta
        if (logoInfo) {
            try {
                const logoWidth = 100;
                const logoHeight = logoWidth / logoInfo.aspectRatio;
                doc.addImage(logoInfo.data, 'PNG', margin, 20, logoWidth, logoHeight);
            } catch (e) {
                console.warn('Error al insertar logo:', e);
            }
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text('ForjaDigitalAE', pageWidth - margin, 40, { align: 'right' });
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Arquitectura Empresarial & Transformacion Digital', pageWidth - margin, 60, { align: 'right' });
        
        let y = 140;
        doc.setFontSize(36);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('REPORTE DE MADUREZ', pageWidth/2, y, { align: 'center' });
        
        y += 45;
        doc.setFontSize(32);
        doc.setTextColor(...colors.purple);
        doc.text('EMPRESARIAL', pageWidth/2, y, { align: 'center' });
        
        y += 70;
        doc.setFillColor(...colors.lightGray);
        doc.setDrawColor(...colors.purple);
        doc.setLineWidth(2);
        doc.roundedRect(margin, y, contentWidth, 120, 10, 10, 'FD');
        
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text(companyData.name || 'Empresa', pageWidth/2, y + 40, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        const companyInfo = `${companyData.sector || 'N/A'} | ${companyData.size || 'N/A'} | ${companyData.city || 'N/A'}`;
        doc.text(companyInfo, pageWidth/2, y + 65, { align: 'center' });
        
        doc.setFontSize(11);
        doc.text(`${companyData.contactName || 'N/A'} | ${companyData.email || 'N/A'}`, pageWidth/2, y + 90, { align: 'center' });
        
        // CORRECCIÓN 2: Círculo con progreso real
        y += 170;
        const circleX = pageWidth / 2;
        const circleY = y + 60;
        const circleRadius = 70;
        
        // Círculo de fondo
        doc.setLineWidth(14);
        doc.setDrawColor(220, 220, 220);
        doc.circle(circleX, circleY, circleRadius, 'S');
        
        // Arco de progreso basado en score real
        const startAngle = -90;
        const progressAngle = (finalScore / 100) * 360;
        const endAngle = startAngle + progressAngle;
        
        doc.setDrawColor(...colors.purple);
        doc.setLineWidth(14);
        
        // Dibujar arco
        const segments = Math.ceil(Math.abs(progressAngle));
        const angleStep = progressAngle / segments;
        
        for (let i = 0; i < segments; i++) {
            const angle1 = (startAngle + (i * angleStep)) * Math.PI / 180;
            const angle2 = (startAngle + ((i + 1) * angleStep)) * Math.PI / 180;
            
            const x1 = circleX + circleRadius * Math.cos(angle1);
            const y1 = circleY + circleRadius * Math.sin(angle1);
            const x2 = circleX + circleRadius * Math.cos(angle2);
            const y2 = circleY + circleRadius * Math.sin(angle2);
            
            doc.line(x1, y1, x2, y2);
        }
        
        doc.setFillColor(...colors.white);
        doc.circle(circleX, circleY, circleRadius - 10, 'F');
        
        doc.setFontSize(48);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.purple);
        doc.text(finalScore.toString(), circleX, circleY + 15, { align: 'center' });
        
        y = circleY + circleRadius + 40;
        const badgeWidth = 180;
        const badgeHeight = 40;
        const badgeX = (pageWidth - badgeWidth) / 2;
        
        doc.setFillColor(...colors.purple);
        doc.roundedRect(badgeX, y, badgeWidth, badgeHeight, 20, 20, 'F');
        
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text(maturityLevel.level, pageWidth/2, y + 27, { align: 'center' });
        
        y += 55;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        doc.text('Nivel de Madurez Empresarial', pageWidth/2, y, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Puntuacion: ${finalScore}/100`, pageWidth/2, y + 18, { align: 'center' });
        
        y += 45;
        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(margin + 30, y, contentWidth - 60, 70, 8, 8, 'F');
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('EVALUACION EJECUTIVA', pageWidth/2, y + 22, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const evaluationText = maturityLevel.description || 'Evaluacion completa de madurez empresarial.';
        const evalLines = doc.splitTextToSize(evaluationText, contentWidth - 100);
        doc.text(evalLines, pageWidth/2, y + 42, { align: 'center' });
        
        // CORRECCIÓN 3: Ajustar espaciado para evitar superposición con el footer
        y = pageHeight - 160; 
        
        const statsY = y;
        const statsWidth = contentWidth / 3 - 10;
        let statsX = margin;
        
        function createStatBox(x, y, number, label, color) {
            doc.setFillColor(...colors.lightGray);
            doc.roundedRect(x, y, statsWidth, 70, 8, 8, 'F');
            
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...color);
            doc.text(number, x + statsWidth/2, y + 45, { align: 'center' });
            
        }
        
        createStatBox(statsX, statsY, '10', 'Dimensiones', colors.purple);
        createStatBox(statsX + statsWidth + 15, statsY, '50', 'Preguntas', colors.turquoise);
        createStatBox(statsX + (statsWidth + 15) * 2, statsY, companyData.sector || 'Sector', 'Sector', colors.orange);
        
        addFooter(doc, pageWidth, pageHeight, logoInfo);
        
        // ========== PÁGINA 2: BARRAS VERTICALES ==========
        
        doc.addPage();
        addPageHeader(doc, pageWidth, 'ANALISIS POR DIMENSIONES', logoInfo);
        
        y = 140;
        
        // CORRECCIÓN 4: Barras verticales
        const numCategories = categories.length;
        const barWidth = 45;
        const barSpacing = 12;
        const totalBarWidth = (barWidth + barSpacing) * numCategories;
        const startX = (pageWidth - totalBarWidth) / 2 + barSpacing / 2;
        const maxBarHeight = 280;
        const baseY = y + maxBarHeight + 50;
        
        doc.setDrawColor(...colors.gray);
        doc.setLineWidth(1);
        doc.line(startX - 10, baseY, startX + totalBarWidth, baseY);
        
        doc.setDrawColor(230, 230, 230);
        for (let i = 0; i <= 5; i++) {
            const lineY = baseY - (maxBarHeight * i / 5);
            doc.line(startX - 10, lineY, startX + totalBarWidth, lineY);
            
            doc.setFontSize(8);
            doc.setTextColor(...colors.gray);
            doc.text((i * 20).toString(), startX - 20, lineY + 3, { align: 'right' });
        }
        
        categories.forEach((category, index) => {
            const score = categoryScores[category.id] || 0;
            const scoreColor = hexToRgbArray(getScoreColor(score));
            
            const barX = startX + (index * (barWidth + barSpacing));
            const barHeight = (maxBarHeight * score) / 100;
            const barY = baseY - barHeight;
            
            doc.setFillColor(200, 200, 200);
            doc.roundedRect(barX + 2, barY + 2, barWidth, barHeight, 4, 4, 'F');
            
            doc.setFillColor(...scoreColor);
            doc.roundedRect(barX, barY, barWidth, barHeight, 4, 4, 'F');
            
            doc.setFillColor(255, 255, 255, 0.3);
            doc.roundedRect(barX, barY, barWidth, Math.min(barHeight, 20), 4, 4, 'F');
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...scoreColor);
            doc.text(score.toString(), barX + barWidth/2, barY - 8, { align: 'center' });
            
            // CORRECCIÓN 5: Nombre sin símbolos raros
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.primary);
            
            const categoryName = category.name;
            const nameLines = doc.splitTextToSize(categoryName, barWidth + 10);
            let nameY = baseY + 15;
            nameLines.forEach(line => {
                doc.text(line, barX + barWidth/2, nameY, { align: 'center' });
                nameY += 10;
            });
        });
        
        // Añadir texto explicativo
        y = baseY + 90;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        const explanationText = 'Esta gráfica muestra su puntaje en cada una de las 10 dimensiones evaluadas, permitiéndole identificar rápidamente sus áreas más fuertes y las que presentan mayores oportunidades de mejora. Un puntaje más alto indica un mayor nivel de madurez en esa dimensión.';
        const textLines = doc.splitTextToSize(explanationText, contentWidth - 40);
        doc.text(textLines, margin + 20, y);
        
        addFooter(doc, pageWidth, pageHeight, logoInfo);
        
        // ========== PÁGINA 3: PUNTUACIONES DETALLADAS ==========
        
        doc.addPage();
        addPageHeader(doc, pageWidth, 'PUNTUACIONES DETALLADAS', logoInfo);
        
        y = 140;
        
        const cardWidth = (contentWidth - 20) / 2;
        const cardHeight = 110;
        let cardX = margin;
        let cardCount = 0;
        
        categories.forEach((category, index) => {
            const score = categoryScores[category.id] || 0;
            const scoreColor = hexToRgbArray(getScoreColor(score));
            const scoreDesc = getScoreDescription(score);
            
            doc.setFillColor(...colors.white);
            doc.setDrawColor(...scoreColor);
            doc.setLineWidth(2);
            doc.roundedRect(cardX, y, cardWidth, cardHeight, 10, 10, 'FD');
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.primary);
            const nameLines = doc.splitTextToSize(category.name, cardWidth - 110);
            doc.text(nameLines, cardX + 15, y + 28);
            
            doc.setFontSize(36);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...scoreColor);
            doc.text(score.toString(), cardX + cardWidth - 20, y + 45, { align: 'right' });
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...scoreColor);
            doc.text(scoreDesc, cardX + 15, y + 70);
            
            const miniBarWidth = cardWidth - 30;
            doc.setFillColor(229, 231, 235);
            doc.roundedRect(cardX + 15, y + 80, miniBarWidth, 8, 4, 4, 'F');
            
            const miniBarProgress = (miniBarWidth * score) / 100;
            doc.setFillColor(...scoreColor);
            doc.roundedRect(cardX + 15, y + 80, miniBarProgress, 8, 4, 4, 'F');
            
            cardCount++;
            if (cardCount % 2 === 0) {
                cardX = margin;
                y += cardHeight + 15;
            } else {
                cardX = margin + cardWidth + 20;
            }
            
            if (y > pageHeight - 200 && index < categories.length - 1) {
                addFooter(doc, pageWidth, pageHeight, logoInfo);
                doc.addPage();
                addPageHeader(doc, pageWidth, 'PUNTUACIONES DETALLADAS', logoInfo);
                y = 140;
                cardX = margin;
                cardCount = 0;
            }
        });
        
        // CORRECCIÓN 6: Insights en la misma página (ELIMINADO)
        
        addFooter(doc, pageWidth, pageHeight, logoInfo);
        
        // ========== PÁGINA 4: PLAN DE ACCIÓN ==========
        
        doc.addPage();
        addPageHeader(doc, pageWidth, 'PLAN DE ACCION ESTRATEGICO', logoInfo);
        
        y = 140;
        
        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(margin, y, contentWidth, 50, 8, 8, 'F');
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.purple);
        doc.text('METODOLOGIA', margin + 15, y + 20);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        doc.text('Recomendaciones priorizadas por impacto vs. esfuerzo de implementacion', margin + 15, y + 38);
        
        y += 70;
        
        const recommendations = generateRecommendations();
        const topRecommendations = recommendations.slice(0, 3);
        
        const priorityColors = {
            'PRIORIDAD 1': [170, 47, 12],
            'PRIORIDAD 2': [238, 128, 40],
            'PRIORIDAD 3': [76, 206, 213],
            'CRITICO': [170, 47, 12], // Rojo
            'ALTO': [238, 128, 40], // Naranja
            'MEDIO': [136, 136, 136] // Gris
        };
        
        topRecommendations.forEach((rec, idx) => {
            if (y > pageHeight - 200) {
                addFooter(doc, pageWidth, pageHeight, logoInfo);
                doc.addPage();
                addPageHeader(doc, pageWidth, 'PLAN DE ACCION ESTRATEGICO', logoInfo);
                y = 140;
            }
            
            const recHeight = 100;
            const priorityColor = priorityColors[rec.priority] || colors.gray;
            
            doc.setFillColor(...priorityColor);
            doc.rect(margin, y, 8, recHeight, 'F');
            
            doc.setFillColor(...colors.white);
            doc.setDrawColor(...colors.gray);
            doc.setLineWidth(1);
            doc.roundedRect(margin + 8, y, contentWidth - 8, recHeight, 8, 8, 'FD');
            
            doc.setFillColor(...priorityColor);
            doc.roundedRect(margin + 20, y + 15, 100, 20, 10, 10, 'F');
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.white);
            doc.text(rec.priority, margin + 70, y + 28, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.primary);
            doc.text(rec.title, margin + 20, y + 50);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.gray);
            const descLines = doc.splitTextToSize(rec.description, contentWidth - 50);
            doc.text(descLines, margin + 20, y + 68);
            
            y += recHeight + 15;
        });
        
        if (y > pageHeight - 150) {
            addFooter(doc, pageWidth, pageHeight, logoInfo);
            doc.addPage();
            addPageHeader(doc, pageWidth, 'CRONOGRAMA SUGERIDO', logoInfo);
            y = 140;
        } else {
            y += 10;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('CRONOGRAMA SUGERIDO', margin, y);
        
        y += 40;
        const timelineSteps = [
            { color: [170, 47, 12], title: 'Mes 1-2', desc: 'Implementar prioridad alta' },
            { color: [238, 128, 40], title: 'Mes 3-4', desc: 'Desarrollar prioridad media' },
            { color: [16, 185, 129], title: 'Mes 5-6', desc: 'Optimizar y consolidar' }
        ];
        
        const stepWidth = (contentWidth - 40) / 3;
        let stepX = margin;
        
        timelineSteps.forEach((step, index) => {
            doc.setFillColor(200, 200, 200);
            doc.circle(stepX + 20 + 2, y + 15 + 2, 18, 'F');
            
            doc.setFillColor(...step.color);
            doc.circle(stepX + 20, y + 15, 18, 'F');
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.white);
            doc.text((index + 1).toString(), stepX + 20, y + 21, { align: 'center' });
            
            if (index < timelineSteps.length - 1) {
                doc.setDrawColor(...colors.gray);
                doc.setLineWidth(2);
                doc.line(stepX + 38, y + 15, stepX + stepWidth, y + 15);
            }
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.primary);
            doc.text(step.title, stepX + 45, y + 12);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.gray);
            const descLines = doc.splitTextToSize(step.desc, stepWidth - 50);
            doc.text(descLines, stepX + 45, y + 28);
            
            stepX += stepWidth;
        });
        
        addFooter(doc, pageWidth, pageHeight, logoInfo);
        
        // ========== PÁGINA 5: CTA ==========
        
        doc.addPage();
        
        y = 60;
        
        doc.setFillColor(...colors.primary);
        doc.roundedRect(0, y, pageWidth, 140, 0, 0, 'F');
        
        if (logoInfo) {
            try {
                const logoWidth = 80;
                const logoHeight = logoWidth / logoInfo.aspectRatio;
                doc.addImage(logoInfo.data, 'PNG', margin, y + 30, logoWidth, logoHeight);
            } catch (e) {}
        }
        
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text('¿LISTO PARA TRANSFORMAR', pageWidth/2, y + 50, { align: 'center' });
        doc.text('TU PYME?', pageWidth/2, y + 78, { align: 'center' });
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Este reporte es el primer paso. Ahora es momento de actuar.', pageWidth/2, y + 100, { align: 'center' });
        doc.text('Nuestro equipo puede acompañarte en cada etapa.', pageWidth/2, y + 118, { align: 'center' });
        
        y = 220;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.primary);
        doc.text('NUESTROS SERVICIOS', pageWidth/2, y, { align: 'center' });
        
        y = 250;
        const services = [
            { title: 'Consultoria Estrategica', desc: 'Implementacion de roadmap personalizado' },
            { title: 'Optimizacion de Procesos', desc: 'Automatizacion de operaciones clave' },
            { title: 'Transformacion Digital', desc: 'Tecnologias para impulsar crecimiento' },
            { title: 'Business Intelligence', desc: 'Sistemas de datos para decisiones' },
            { title: 'Definición de Procesos', desc: 'Mapeo y optimización de flujos de trabajo' },
            { title: 'Implementación de IA', desc: 'Soluciones de inteligencia artificial para tu negocio' }
        ];
        
        const serviceBoxWidth = (contentWidth - 20) / 2;
        const serviceBoxHeight = 80;
        let serviceX = margin;
        let serviceY = y;
        let serviceCount = 0;
        
        services.forEach((service, idx) => {
            if (serviceCount > 0 && serviceCount % 2 === 0) {
                serviceX = margin;
                serviceY += serviceBoxHeight + 15;
            }

            doc.setFillColor(...colors.lightGray);
            doc.roundedRect(serviceX, serviceY, serviceBoxWidth, serviceBoxHeight, 10, 10, 'F');
            
            doc.setDrawColor(...colors.purple);
            doc.setLineWidth(2);
            doc.roundedRect(serviceX, serviceY, serviceBoxWidth, serviceBoxHeight, 10, 10, 'S');
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.purple);
            doc.text(service.title, serviceX + 15, serviceY + 30);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.gray);
            const serviceDescLines = doc.splitTextToSize(service.desc, serviceBoxWidth - 30);
            doc.text(serviceDescLines, serviceX + 15, serviceY + 50);
            
            serviceCount++;
            serviceX += serviceBoxWidth + 20;
        });
        
        y = serviceY + serviceBoxHeight + 40;
        doc.setFillColor(...colors.purple);
        doc.roundedRect(margin, y, contentWidth, 70, 10, 10, 'F');
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.white);
        doc.text('AGENDA CONSULTA GRATUITA DE 30 MINUTOS', pageWidth/2, y + 28, { align: 'center' });
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Analicemos los resultados y definamos el mejor camino', pageWidth/2, y + 50, { align: 'center' });
        
        y += 90;
        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(margin, y, contentWidth, 100, 10, 10, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.purple);
        doc.text('CONTACTO DIRECTO', pageWidth/2, y + 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.primary);
        doc.text('forjadigitalae@gmail.com', pageWidth/2, y + 55, { align: 'center' });
        doc.text('+57-3143265590', pageWidth/2, y + 75, { align: 'center' });
        
        addFooter(doc, pageWidth, pageHeight, logoInfo);
        
        // Guardar PDF
        const safeCompanyName = (companyData.name || 'Empresa').replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
        const fileName = `Reporte_Madurez_${safeCompanyName}_${new Date().getFullYear()}.pdf`;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        doc.save(fileName);
        
        showToast('Reporte generado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error generando PDF:', error);
        showToast('Error al generar el reporte', 'error');
    } finally {
        hideLoading();
    }
}

// Funciones auxiliares
function addPageHeader(doc, pageWidth, title, logoInfo) {
    const headerHeight = 80;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    if (logoInfo) {
        try {
            const logoWidth = 70;
            const logoHeight = logoWidth / logoInfo.aspectRatio;
            doc.addImage(logoInfo.data, 'PNG', 40, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
        } catch (e) {}
    }
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 50, 90);
    doc.text(title, pageWidth - 40, 40, { align: 'right' });
    
    doc.setDrawColor(133, 96, 192);
    doc.setLineWidth(2);
    doc.line(40, headerHeight - 5, pageWidth - 40, headerHeight - 5);
}

function addFooter(doc, pageWidth, pageHeight, logoInfo) {
    const footerY = pageHeight - 40;
    
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(40, footerY, pageWidth - 40, footerY);
    
    const currentDate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    
    doc.text(currentDate, 40, pageHeight - 20);
    doc.text(`Pagina ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 40, pageHeight - 20, { align: 'right' });
    
    doc.setFontSize(7);
    doc.text('forjadigitalae@gmail.com | +57-3143265590 | www.forjadigitalae.com', pageWidth/2, pageHeight - 15, { align: 'center' });
}

// ===== FUNCIONES AUXILIARES PARA PDF MEJORADO =====

// Función para agregar header de página con logo
function addPageHeader(doc, pageWidth, title, logoData) {
    const headerHeight = 80;
    
    // Fondo del header
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Logo pequeño
    if (logoData) {
        try {
            const logoWidth = 70;
            const logoHeight = logoWidth / logoData.aspectRatio;
            doc.addImage(logoData, 'PNG', 40, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
        } catch (e) {
            console.warn('Error al insertar logo en header:', e);
        }
    }
    
    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 50, 90);
    doc.text(title, pageWidth - 40, 40, { align: 'right' });
    
    // Línea separadora
    doc.setDrawColor(133, 96, 192);
    doc.setLineWidth(2);
    doc.line(40, headerHeight - 5, pageWidth - 40, headerHeight - 5);
}

// Función para agregar footer con logo
function addFooter(doc, pageWidth, pageHeight, logoData) {
    const footerY = pageHeight - 40;
    
    // Línea separadora
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(40, footerY, pageWidth - 40, footerY);
    
    const currentDate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    
    // Fecha
    doc.text(currentDate, 40, pageHeight - 20);
    
    // Página
    doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 40, pageHeight - 20, { align: 'right' });
    
    // Contacto centrado
    doc.setFontSize(7);
    doc.text('forjadigitalae@gmail.com | +57-3143265590 | www.forjadigitalae.com', pageWidth/2, pageHeight - 15, { align: 'center' });
}

// Funciones auxiliares para PDF
function getTopCategory() {
    const categoryScores = appState.evaluationData.categoryScores || {};
    let topCategory = { id: '', score: 0 };
    
    categories.forEach(cat => {
        const score = categoryScores[cat.id] || 0;
        if (score > topCategory.score) {
            topCategory = { id: cat.id, score: score };
        }
    });
    
    return topCategory;
}

function getLowestCategory() {
    const categoryScores = appState.evaluationData.categoryScores || {};
    let lowestCategory = { id: '', score: 100 };
    
    categories.forEach(cat => {
        const score = categoryScores[cat.id] || 0;
        if (score < lowestCategory.score) {
            lowestCategory = { id: cat.id, score: score };
        }
    });
    
    return lowestCategory;
}

function getCategoryNameById(id) {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'N/A';
}

// Función auxiliar para convertir hex a RGB
function hexToRgbArray(hex) {
    if (!hex || typeof hex !== 'string') return [0, 0, 0];
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Botón principal de landing
    const btnEvaluar = document.getElementById('btnStartEvaluation');
    if (btnEvaluar) {
        btnEvaluar.addEventListener('click', () => showSection('registration'));
    }

    // Enlace de política de privacidad
    const privacyLink = document.getElementById('privacyPolicyLink');
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPrivacyPolicy();
        });
    }

    const btnClosePrivacy = document.getElementById('btnClosePrivacy');
    if (btnClosePrivacy) {
        btnClosePrivacy.addEventListener('click', hidePrivacyPolicy);
    }

    // Formulario de registro
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    // Botones de navegación de evaluación
    const btnPrevQuestion = document.getElementById('prevBtn');
    if (btnPrevQuestion) {
        btnPrevQuestion.addEventListener('click', previousQuestion);
    }

    const btnNextQuestion = document.getElementById('nextBtn');
    if (btnNextQuestion) {
        btnNextQuestion.addEventListener('click', nextQuestion);
    }

    // Botón de descarga PDF
    const btnDownloadPDF = document.getElementById('btnDownloadPDF');
    if (btnDownloadPDF) {
        btnDownloadPDF.addEventListener('click', downloadPDF);
    }

    // Botón de reiniciar
    const btnReset = document.getElementById('btnResetApp');
    if (btnReset) {
        btnReset.addEventListener('click', resetApp);
    }
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar autoSave con debounce
const debouncedAutoSave = debounce(autoSave, 500);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando ForjaDigitalAE...');
    
    // Verificar compatibilidad del navegador
    if (!window.fetch || !window.localStorage) {
        showToast('Tu navegador no es compatible. Por favor usa una versión más reciente.', 'error');
        return;
    }
    
    showSection('landing');
    loadSavedState();
    initEventListeners();
    
    // Precargar recursos críticos
    preloadCriticalResources();
    
    console.log('✅ Aplicación lista');
});

function preloadCriticalResources() {
    // Precargar logo
    const logoImg = new Image();
    logoImg.src = 'https://forjadigitalae.github.io/LOGO%20F_OSC.png';
    
    // Precargar librerías externas si no están cargadas
    if (!window.jspdf) {
        console.warn('⚠️ jsPDF no está disponible');
    }
    if (!window.Chart) {
        console.warn('⚠️ Chart.js no está disponible');
    }
}

// Prevenir errores de recursos externos
window.addEventListener('error', function(e) {
    if (e.message && (e.message.includes('claschadder') || e.message.includes('tracker'))) {
        e.preventDefault();
        return false;
    }
});

console.log('%c🚀 ForjaDigitalAE - Evaluación inicializada correctamente', 'color: #4CCED5; font-size: 16px; font-weight: bold;');
console.log('%c📊 Versión: 4.0 - Separación Modular', 'color: #EE8028; font-size: 12px;')

function renderBenchmarkComponent() {
    const container = document.getElementById('benchmarkContainer');
    if (!container) return;

    const userScores = appState.evaluationData.categoryScores;
    const userSector = appState.companyData.sector;
    const benchmarkData = obtenerBenchmarkPorSector(userSector);

    if (!benchmarkData) {
        container.innerHTML = `<p>No hay datos de benchmarking disponibles para el sector '${userSector}'.</p>`;
        return;
    }

    const { pyme_promedio, lider_mercado } = benchmarkData;
    const overallScores = {
        user: calcularScoreGeneral(userScores),
        pyme: calcularScoreGeneral(pyme_promedio),
        lider: calcularScoreGeneral(lider_mercado)
    };

    const percentile = calcularPercentil(overallScores.user, overallScores.pyme, overallScores.lider);
    const position = obtenerPosicionMercado(percentile);
    const brechas = calcularBrechasCriticas(userScores, lider_mercado);

    container.innerHTML = `
        <!-- 1. Resumen Competitivo -->
        <div class="benchmark-summary">
            <div class="summary-item">
                <div class="summary-label">Tu Empresa</div>
                <div class="summary-score" style="color: #8B5CF6;">${overallScores.user}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">PYME Promedio</div>
                <div class="summary-score" style="color: #F97316;">${overallScores.pyme}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Líder del Sector</div>
                <div class="summary-score" style="color: #10B981;">${overallScores.lider}</div>
            </div>
        </div>
        <div class="benchmark-progress-bar">
            <div class="progress-marker user-marker" style="left: ${overallScores.user}%;" title="Tu Empresa: ${overallScores.user}">
                <span class="marker-label">Tú</span>
            </div>
            <div class="progress-marker pyme-marker" style="left: ${overallScores.pyme}%;" title="PYME Promedio: ${overallScores.pyme}">
                <span class="marker-label">Promedio</span>
            </div>
            <div class="progress-marker lider-marker" style="left: ${overallScores.lider}%;" title="Líder: ${overallScores.lider}">
                <span class="marker-label">Líder</span>
            </div>
        </div>

        <!-- 2. Gráfico de Radar Comparativo -->
        <div class="chart-container" style="height: 400px; margin-top: 2rem;">
            <canvas id="benchmarkRadarChart"></canvas>
        </div>

        <!-- 3. Tabla de Análisis de Brechas -->
        <h3 class="text-h3 mt-8 mb-4">Análisis de Brechas Competitivas</h3>
        <div class="gap-analysis-table">
            <div class="table-header">
                <div>Dimensión</div>
                <div>Tu Score</div>
                <div>Brecha vs Promedio</div>
                <div>Brecha vs Líder</div>
                <div>Prioridad</div>
            </div>
            ${categories.map(cat => {
                const userScore = userScores[cat.id] || 0;
                const pymeScore = pyme_promedio[cat.id] || 0;
                const liderScore = lider_mercado[cat.id] || 0;
                const gapPyme = userScore - pymeScore;
                const gapLider = userScore - liderScore;
                const brechaInfo = brechas.find(b => b.dimension === cat.id) || { prioridad: 'Baja' };

                return `
                <div class="table-row">
                    <div>${cat.name}</div>
                    <div><strong>${userScore}</strong></div>
                    <div style="color: ${gapPyme >= 0 ? '#10B981' : '#EF4444'};">${gapPyme >= 0 ? '+' : ''}${gapPyme}</div>
                    <div style="color: ${gapLider >= 0 ? '#10B981' : '#EF4444'};">${gapLider >= 0 ? '+' : ''}${gapLider}</div>
                    <div><span class="priority-pill ${brechaInfo.prioridad.toLowerCase()}">${brechaInfo.prioridad}</span></div>
                </div>
                `;
            }).join('')}
        </div>

        <!-- 4. Interpretación de Posición -->
        <div class="position-interpretation ${position.class}">
            <h4>${position.title} (Top ${percentile}%)</h4>
            <p>${position.message}</p>
        </div>
    `;

    renderBenchmarkRadar(userScores, pyme_promedio, lider_mercado);
}

function renderBenchmarkRadar(user, pyme, lider) {
    const canvas = document.getElementById('benchmarkRadarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = categories.map(cat => cat.name);

    if (window.radarChartInstance) {
        window.radarChartInstance.destroy();
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Tu Empresa',
                data: Object.values(user),
                backgroundColor: 'rgba(133, 96, 192, 0.2)',
                borderColor: 'rgba(133, 96, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'PYME Promedio',
                data: Object.values(pyme),
                backgroundColor: 'rgba(238, 128, 40, 0.2)',
                borderColor: 'rgba(238, 128, 40, 1)',
                borderWidth: 1
            },
            {
                label: 'Líder del Sector',
                data: Object.values(lider),
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
            }
        ]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    };

    window.radarChartInstance = new Chart(ctx, config);
}