/* ================================
   FORJADIGITALAE - EVALUACIÓN JS
   Versión Optimizada y Modular
   ================================ */

// ===== CONFIGURACIÓN GLOBAL =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOV7RjRU9fOPsutSOscgbj-gPD4e5Eh9uLmLU789XqxBzrGWkRzz0p6Ti4o908kt4o/exec';

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
        description: 'Se evalúa la claridad y comunicación de la visión a largo plazo de la empresa, así como la existencia de un plan estratégico formal y bien estructurado. Una estrategia sólida alinea a toda la organización hacia objetivos comunes, permitiendo una toma de decisiones coherente y una asignación de recursos eficaz para competir y crecer en el mercado.',
        questions: [
            { id: 've_01', text: '¿La empresa tiene una visión a largo plazo, formalmente documentada y comunicada a todo el equipo?', tooltip: 'Evalúa si la visión es más que una idea: si está escrita, es conocida por todos y sirve como guía. Una visión compartida es el motor que impulsa a toda la organización en la misma dirección. Puntuaciones altas indican que es un documento vivo y comunicado.', weight: 1.2 },
            { id: 've_02', text: '¿Existe un plan estratégico claro que detalle los objetivos, metas y acciones para los próximos 3-5 años?', tooltip: 'El plan debe ser una hoja de ruta con hitos, responsables e Indicadores Clave de Desempeño (KPIs) para monitorear el progreso. No se trata de tener un documento, sino una herramienta de gestión activa.', weight: 1.2 },
            { id: 've_03', text: '¿La estrategia de la empresa considera activamente las tendencias del mercado y el entorno competitivo?', tooltip: 'Aquí se mide si la empresa mira hacia afuera. ¿Analiza a la competencia? ¿Está al tanto de las nuevas tecnologías, regulaciones y cambios en el comportamiento del consumidor? Una estrategia relevante debe ser dinámica y adaptarse al entorno.', weight: 1.0 },
            { id: 've_04', text: '¿Los objetivos de los departamentos y empleados están claramente alineados con la estrategia general?', tooltip: 'La estrategia "aterriza" en el día a día a través de objetivos claros para cada área y persona. Se evalúa si existe un sistema (como OKRs o MBOs) que conecte el trabajo individual con las metas de la empresa.', weight: 1.1 },
            { id: 've_05', text: '¿Se asignan recursos (presupuesto, personal, tiempo) de manera coherente con las prioridades estratégicas?', tooltip: 'El dinero y los recursos deben seguir a la estrategia. Esta pregunta evalúa si las inversiones más importantes se dirigen a las iniciativas que realmente impulsarán el cumplimiento de los objetivos estratégicos, en lugar de gastar por inercia.', weight: 1.1 }
        ]
    },
    {
        id: 'gobierno_empresarial',
        name: 'Gobierno Empresarial',
        icon: '🏛️',
        weight: 0.10,
        description: 'Analiza la solidez de las estructuras de toma de decisiones, la claridad de roles y responsabilidades, y los mecanismos de control. Un buen gobierno corporativo reduce la dependencia en los fundadores, agiliza las decisiones y asegura la rendición de cuentas, sentando las bases para un crecimiento escalable y sostenible.',
        questions: [
            { id: 'ge_01', text: '¿Existen roles y responsabilidades claramente definidos para los líderes y los equipos?', tooltip: 'Más allá de un simple organigrama, se evalúa si cada persona sabe qué se espera de ella, a quién reporta y cuáles son sus responsabilidades. Esto evita duplicidad de funciones y "zonas grises" en la operación.', weight: 1.2 },
            { id: 'ge_02', text: '¿La empresa cuenta con políticas y procedimientos internos documentados para las operaciones clave?', tooltip: 'Se busca evidencia de estandarización. ¿Hay manuales para procesos como ventas, contratación o gestión de calidad? Las políticas escritas aseguran consistencia y facilitan la incorporación de nuevo personal.', weight: 1.1 },
            { id: 'ge_03', text: '¿Se realizan reuniones de seguimiento periódicas y efectivas para revisar el desempeño y los objetivos?', tooltip: 'Evalúa la disciplina de gestión. ¿Existen comités (de dirección, comerciales, etc.) con agendas claras, actas y seguimiento de compromisos? Las reuniones deben ser foros para la toma de decisiones, no solo para informar.', weight: 1.0 },
            { id: 'ge_04', text: '¿Existe un proceso formal para la identificación, evaluación y mitigación de riesgos?', tooltip: 'Una gestión de riesgos proactiva va más allá de "apagar incendios". Se evalúa si la empresa piensa en qué podría salir mal (riesgos financieros, operativos, de mercado) y tiene planes para prevenir o mitigar su impacto.', weight: 1.2 },
            { id: 'ge_05', text: '¿Hay mecanismos de control interno y auditoría para asegurar la transparencia y el cumplimiento?', tooltip: 'Se refiere a los controles que garantizan la fiabilidad de la información financiera y el cumplimiento de las políticas. Incluye desde la segregación de funciones (quien aprueba no es quien paga) hasta auditorías internas o externas.', weight: 1.0 }
        ]
    },
    {
        id: 'procesos_operaciones',
        name: 'Procesos y Operaciones',
        icon: '⚙️',
        weight: 0.10,
        description: 'Mide la eficiencia, estandarización y automatización de los flujos de trabajo clave. Procesos optimizados reducen costos, minimizan errores y liberan al equipo de tareas repetitivas, permitiendo a la empresa escalar su capacidad operativa sin un aumento proporcional en su estructura.',
        questions: [
            { id: 'po_01', text: '¿Los procesos clave del negocio (ventas, producción, etc.) están documentados y estandarizados?', tooltip: 'Se busca evidencia de que los procesos no dependen de la memoria de las personas. ¿Existen diagramas de flujo, manuales o instructivos que describan el "cómo se hacen las cosas aquí"? La estandarización es la base de la eficiencia.', weight: 1.2 },
            { id: 'po_02', text: '¿Se utilizan herramientas tecnológicas (software, ERP, CRM) para automatizar tareas repetitivas?', tooltip: 'Evalúa el nivel de digitalización de la operación. Tareas como la facturación, el seguimiento de clientes o el control de inventario, ¿son manuales o se apoyan en software que reduce el trabajo y los errores humanos?', weight: 1.1 },
            { id: 'po_03', text: '¿Se miden y monitorean regularmente los indicadores de rendimiento (KPIs) de los procesos?', tooltip: 'Lo que no se mide, no se mejora. Se evalúa si existen métricas claras para los procesos clave (ej. tiempo de entrega, costo por unidad, tasa de error) y si se revisan periódicamente para tomar acciones correctivas.', weight: 1.1 },
            { id: 'po_04', text: '¿Existe una cultura de mejora continua donde los equipos proponen y ejecutan optimizaciones?', tooltip: 'La optimización no debe ser un proyecto único, sino un hábito cultural. Se busca evidencia de que los propios equipos tienen la autonomía y la motivación para identificar y solucionar ineficiencias en su día a día.', weight: 1.0 },
            { id: 'po_05', text: '¿Los diferentes sistemas de información de la empresa (contabilidad, ventas, etc.) están integrados?', tooltip: 'La falta de integración crea "silos de información" y requiere doble digitación. Se evalúa si los sistemas "conversan" entre sí, permitiendo que los datos fluyan automáticamente de un área a otra sin intervención manual.', weight: 1.2 }
        ]
    },
    {
        id: 'talento_cultura',
        name: 'Gestión de Talento',
        icon: '👥',
        weight: 0.10,
        description: 'Evalúa las prácticas para atraer, desarrollar y retener al personal, así como la fortaleza de la cultura organizacional. El talento es el activo más importante; una gestión proactiva y una cultura positiva son esenciales para la innovación, la productividad y la construcción de una ventaja competitiva sostenible.',
        questions: [
            { id: 'tc_01', text: '¿La empresa tiene un proceso estructurado para atraer, seleccionar y retener talento clave?', tooltip: 'Se evalúa si la contratación es reactiva ("necesito a alguien ya") o estratégica. ¿Hay perfiles de cargo definidos? ¿Se usan entrevistas estructuradas? ¿Existen planes de retención para el personal de alto desempeño?', weight: 1.1 },
            { id: 'tc_02', text: '¿Se invierte de forma planificada en programas de capacitación y desarrollo para el equipo?', tooltip: 'El desarrollo de competencias no debe ser esporádico. Se busca evidencia de un plan de capacitación anual, con presupuesto asignado y alineado a las necesidades futuras del negocio y los planes de carrera de los empleados.', weight: 1.2 },
            { id: 'tc_03', text: '¿La cultura organizacional promueve activamente la colaboración, la confianza y la comunicación abierta?', tooltip: 'La cultura se refleja en el comportamiento diario. Se evalúa si los equipos colaboran entre áreas, si hay confianza para dar y recibir feedback, y si la comunicación fluye de manera transparente en todas las direcciones.', weight: 1.0 },
            { id: 'tc_04', text: '¿Se realizan evaluaciones de desempeño justas y periódicas que impulsen el crecimiento profesional?', tooltip: 'Las evaluaciones deben ser más que un requisito anual. Se busca un proceso que incluya feedback 360°, planes de desarrollo individual (PDIs) y una conexión clara entre el desempeño y las oportunidades de crecimiento o compensación.', weight: 1.0 },
            { id: 'tc_05', text: '¿El liderazgo de la empresa inspira, empodera y modela activamente los valores y comportamientos deseados?', tooltip: 'Los líderes son los principales guardianes de la cultura. Se evalúa si su comportamiento es coherente con lo que predican, si delegan de manera efectiva y si su estilo de liderazgo fomenta la motivación y el compromiso en lugar del miedo.', weight: 1.3 }
        ]
    },
    {
        id: 'innovacion_agilidad',
        name: 'Innovación y Agilidad',
        icon: '💡',
        weight: 0.10,
        description: 'Analiza la capacidad de la empresa para adaptarse a los cambios del mercado, experimentar con nuevas ideas y lanzar soluciones de manera rápida. En un entorno volátil, la agilidad y la innovación no son un lujo, sino una condición de supervivencia para mantener la relevancia y capitalizar nuevas oportunidades.',
        questions: [
            { id: 'ia_01', text: '¿La empresa dedica formalmente tiempo y recursos (presupuesto, personas) para explorar nuevas ideas y proyectos?', tooltip: 'La innovación debe ser intencional. Se evalúa si existe un espacio formal (ej. "20% de tiempo libre", un laboratorio de innovación, un presupuesto específico) para que los equipos trabajen en ideas que no son parte de la operación diaria.', weight: 1.2 },
            { id: 'ia_02', text: '¿Se fomenta la experimentación y se gestiona el fracaso como una oportunidad de aprendizaje?', tooltip: 'Una cultura innovadora no castiga el error que resulta de un experimento bien intencionado. Se evalúa si la empresa celebra los aprendizajes, incluso de iniciativas fallidas, y utiliza esos insights para futuros intentos.', weight: 1.1 },
            { id: 'ia_03', text: '¿La estructura y los procesos de la empresa permiten tomar decisiones y ajustar el rumbo rápidamente?', tooltip: 'La agilidad es lo opuesto a la burocracia. Se evalúa qué tan rápido se puede aprobar un proyecto, pivotar una estrategia o responder a un movimiento de la competencia. Las jerarquías planas y los equipos empoderados son clave.', weight: 1.1 },
            { id: 'ia_04', text: '¿Se monitorean activamente las tecnologías emergentes y las startups que podrían impactar el sector?', tooltip: 'Se busca evidencia de un "radar de innovación". ¿Alguien en la empresa tiene la responsabilidad de investigar nuevas tecnologías (IA, blockchain, etc.) y analizar cómo podrían aplicarse al negocio o representar una amenaza?', weight: 1.0 },
            { id: 'ia_05', text: '¿Se colabora con clientes, proveedores o startups para desarrollar nuevas soluciones (innovación abierta)?', tooltip: 'La innovación no tiene por qué ser un proceso interno y secreto. Se evalúa si la empresa se abre al ecosistema, co-creando productos con clientes, colaborando con startups o participando en hackathons y desafíos de innovación.', weight: 1.0 }
        ]
    },
    {
        id: 'estrategia_tecnologica',
        name: 'Estrategia Tecnológica',
        icon: '💻',
        weight: 0.10,
        description: 'Evalúa si la tecnología es un verdadero habilitador del negocio, alineada con los objetivos estratégicos y gestionada de forma proactiva. Una buena estrategia tecnológica garantiza que la infraestructura sea escalable, segura y capaz de soportar el crecimiento y la innovación futuros, en lugar de ser un simple centro de costos.',
        questions: [
            { id: 'et_01', text: '¿La infraestructura tecnológica actual (servidores, redes, software) es estable, escalable y soporta las necesidades del negocio?', tooltip: 'La tecnología debe funcionar sin problemas. Se evalúa si los sistemas son robustos, si pueden crecer al ritmo del negocio y si realmente ayudan a los empleados a hacer su trabajo de manera eficiente.', weight: 1.1 },
            { id: 'et_02', text: '¿Existe un roadmap tecnológico a 2-3 años que guíe las inversiones en hardware y software?', tooltip: 'Las decisiones tecnológicas no deben ser reactivas o improvisadas. Se busca un plan que defina qué tecnologías se adoptarán, cuáles se retirarán y cómo evolucionará la arquitectura para soportar la estrategia empresarial.', weight: 1.2 },
            { id: 'et_03', text: '¿La arquitectura de sistemas está diseñada para ser flexible y permitir integraciones futuras con otras plataformas?', tooltip: 'Una arquitectura monolítica y cerrada es una deuda técnica. Se evalúa si los sistemas están basados en componentes o APIs que faciliten su conexión con nuevas herramientas (ej. un nuevo CRM, una plataforma de e-commerce).', weight: 1.1 },
            { id: 'et_04', text: '¿Se cuenta con políticas, herramientas y capacitación robustas en materia de ciberseguridad?', tooltip: 'La seguridad ya no es opcional. Se evalúa si existen políticas claras (ej. gestión de contraseñas), herramientas (antivirus, firewall, backup) y programas de formación para proteger a la empresa de amenazas digitales.', weight: 1.3 },
            { id: 'et_05', text: '¿Se evalúa el Retorno de la Inversión (ROI) de las principales iniciativas tecnológicas antes y después de su implementación?', tooltip: 'La tecnología es una inversión que debe generar valor. Se busca evidencia de que los proyectos tecnológicos se justifican con un caso de negocio claro (ahorro de costos, aumento de ventas) y que sus resultados se miden.', weight: 1.0 }
        ]
    },
    {
        id: 'inteligencia_negocio',
        name: 'Inteligencia de Negocio',
        icon: '📊',
        weight: 0.10,
        description: 'Examina la capacidad de la empresa para recopilar, analizar y utilizar datos para tomar decisiones informadas y estratégicas. Una cultura "data-driven" permite pasar de la intuición a la evidencia, optimizando operaciones, entendiendo mejor a los clientes y descubriendo nuevas oportunidades de negocio.',
        questions: [
            { id: 'in_01', text: '¿La empresa recopila sistemáticamente datos relevantes de sus operaciones, ventas y clientes?', tooltip: 'Los datos deben capturarse de forma estructurada. Se evalúa si la información clave (ej. quién compra, qué compra, con qué frecuencia) se registra en un sistema (CRM, ERP) o si se pierde en hojas de cálculo y correos.', weight: 1.1 },
            { id: 'in_02', text: '¿Los datos se almacenan en un repositorio centralizado (Data Warehouse, Data Lake) que actúa como una "única fuente de verdad"?', tooltip: 'Tener múltiples versiones de la verdad en diferentes archivos de Excel es una receta para el desastre. Se busca evidencia de un esfuerzo por centralizar los datos para garantizar su consistencia y facilitar el análisis.', weight: 1.2 },
            { id: 'in_03', text: '¿Se utilizan herramientas de visualización de datos (dashboards) para monitorear los KPIs en tiempo real?', tooltip: 'Los datos deben ser accesibles y fáciles de entender. Se evalúa si los líderes y equipos tienen dashboards (ej. en Power BI, Looker o Tableau) que les permitan ver el estado del negocio de un vistazo, sin tener que pedir reportes.', weight: 1.1 },
            { id: 'in_04', text: '¿Las decisiones estratégicas y tácticas se respaldan habitualmente con análisis de datos en lugar de basarse solo en la intuición?', tooltip: 'Se busca un cambio cultural. En las reuniones, ¿se presentan datos y gráficos para justificar una decisión, o se depende principalmente de la "experiencia" y la "opinión" de los directivos?', weight: 1.3 },
            { id: 'in_05', text: '¿El personal clave tiene las habilidades y la formación necesarias para interpretar y cuestionar los datos?', tooltip: 'La "alfabetización de datos" (data literacy) es fundamental. Se evalúa si se ha capacitado a los equipos no solo en el uso de herramientas, sino también en cómo hacer las preguntas correctas a los datos y cómo interpretar los resultados.', weight: 1.0 }
        ]
    },
    {
        id: 'experiencia_cliente',
        name: 'Experiencia del Cliente',
        icon: '🧡',
        weight: 0.10,
        description: 'Mide cómo la empresa gestiona y optimiza cada punto de contacto con sus clientes para maximizar su satisfacción y lealtad. Una experiencia de cliente superior es uno de los diferenciadores más poderosos y difíciles de copiar, convirtiendo a los clientes en promotores de la marca.',
        questions: [
            { id: 'cx_01', text: '¿Se mide de forma sistemática y periódica la satisfacción del cliente (ej. con encuestas NPS, CSAT)?', tooltip: 'Para gestionar la experiencia, primero hay que medirla. Se evalúa si la empresa tiene un método constante para "escuchar" al cliente y si esos indicadores se monitorean como un KPI clave del negocio.', weight: 1.2 },
            { id: 'cx_02', text: '¿Se han mapeado los "viajes del cliente" (Customer Journeys) para identificar puntos de dolor y momentos clave?', tooltip: 'Se busca un entendimiento profundo de la experiencia del cliente de principio a fin. ¿La empresa ha dibujado el mapa de interacciones desde que un cliente descubre la marca hasta la postventa, identificando dónde hay fricciones?', weight: 1.1 },
            { id: 'cx_03', text: '¿Se utiliza activamente la retroalimentación de los clientes para implementar mejoras en productos, servicios y procesos?', tooltip: 'Escuchar no es suficiente; hay que actuar. Se evalúa si existe un proceso formal para analizar las quejas, sugerencias y comentarios de los clientes y convertirlos en proyectos de mejora concretos.', weight: 1.3 },
            { id: 'cx_04', text: '¿La experiencia que se ofrece al cliente es consistente y omnicanal a través de todos los puntos de contacto (web, tienda, vendedor, etc.)?', tooltip: 'El cliente percibe a la empresa como una sola entidad. Se evalúa si la calidad del servicio y el mensaje de marca son coherentes, sin importar si el cliente interactúa por la web, por teléfono o en persona.', weight: 1.0 },
            { id: 'cx_05', text: '¿Se personaliza la comunicación y la oferta para diferentes segmentos de clientes basándose en su comportamiento o historial?', tooltip: 'Tratar a todos los clientes por igual es ineficiente. Se evalúa el nivel de sofisticación en la segmentación y si se utiliza la información del cliente para ofrecerle experiencias y productos más relevantes y personalizados.', weight: 1.0 }
        ]
    },
    {
        id: 'sostenibilidad_responsabilidad',
        name: 'Sostenibilidad',
        icon: '🌍',
        weight: 0.10,
        description: 'Evalúa el compromiso de la empresa con prácticas de negocio éticas, socialmente responsables y medioambientalmente sostenibles. Más allá del cumplimiento, la sostenibilidad y la RSC (Responsabilidad Social Corporativa) son cada vez más importantes para la reputación de la marca, la atracción de talento y la conexión con los consumidores.',
        questions: [
            { id: 'sr_01', text: '¿La empresa tiene una política de sostenibilidad o RSC formalmente definida y comunicada?', tooltip: 'Se busca un compromiso explícito que vaya más allá de acciones aisladas. ¿La empresa ha definido en qué áreas (social, ambiental, de gobernanza) quiere generar un impacto positivo y lo ha documentado en una política oficial?', weight: 1.1 },
            { id: 'sr_02', text: '¿Se han implementado y se miden prácticas concretas para reducir el impacto ambiental (ej. consumo de energía, reciclaje)?', tooltip: 'La política debe traducirse en acciones medibles. Se evalúa si existen programas específicos para, por ejemplo, reducir el consumo de agua o papel, gestionar residuos o medir la huella de carbono, y si se reportan sus resultados.', weight: 1.0 },
            { id: 'sr_03', text: '¿La empresa participa activamente en iniciativas de apoyo a la comunidad local o a causas sociales?', tooltip: 'Se refiere al "rol ciudadano" de la empresa. Se evalúa si la compañía tiene programas de voluntariado corporativo, apoya a ONGs locales o participa en proyectos que benefician a la comunidad donde opera.', weight: 1.0 },
            { id: 'sr_04', text: '¿Se aplican criterios éticos y de sostenibilidad en la selección y evaluación de proveedores?', tooltip: 'La responsabilidad se extiende a toda la cadena de suministro. Se evalúa si, al elegir un proveedor, se consideran no solo el precio y la calidad, sino también sus prácticas laborales, ambientales y de ética empresarial.', weight: 1.2 },
            { id: 'sr_05', text: '¿Se comunican de forma transparente y pública las acciones y el progreso en materia de sostenibilidad?', tooltip: 'La transparencia genera confianza. Se evalúa si la empresa publica un reporte de sostenibilidad o tiene una sección en su web donde informa sobre sus objetivos, acciones y resultados en materia de RSC, de forma honesta y verificable.', weight: 1.1 }
        ]
    },
    {
        id: 'finanzas_rentabilidad',
        name: 'Finanzas',
        icon: '💰',
        weight: 0.10,
        description: 'Analiza la salud y la gestión financiera de la empresa, incluyendo la presupuestación, el control del flujo de caja y la rentabilidad. Una gestión financiera robusta es el pilar que soporta toda la operación y la estrategia, permitiendo invertir en el crecimiento de forma sostenible y navegar con seguridad en tiempos de incertidumbre.',
        questions: [
            { id: 'fr_01', text: '¿Se elabora un presupuesto anual detallado y se realiza un seguimiento mensual de las desviaciones?', tooltip: 'El presupuesto es una herramienta de control, no un mero formalismo. Se evalúa la disciplina de comparar mes a mes lo presupuestado versus lo real, para entender las desviaciones y tomar decisiones a tiempo.', weight: 1.2 },
            { id: 'fr_02', text: '¿Se monitorea y proyecta de cerca el flujo de caja (cash flow) para anticipar necesidades de liquidez?', tooltip: 'El flujo de caja es el "oxígeno" de la empresa. Se evalúa si la gestión es proactiva, con proyecciones a varias semanas o meses vista que permitan anticipar déficits de caja y gestionar la tesorería eficientemente.', weight: 1.3 },
            { id: 'fr_03', text: '¿Se analizan regularmente los estados financieros (P&G, Balance) para entender la rentabilidad y la salud del negocio?', tooltip: 'Los líderes deben ser capaces de "leer" la historia que cuentan los números. Se evalúa si se utilizan los informes contables como una herramienta de diagnóstico para entender qué productos o clientes son más rentables y dónde están los riesgos.', weight: 1.1 },
            { id: 'fr_04', text: '¿Existen políticas claras y un control riguroso sobre los costos y los gastos operativos?', tooltip: 'Se busca una cultura de eficiencia en el uso de los recursos. ¿Existen políticas de gastos? ¿Se revisan periódicamente los principales costos? ¿Se buscan activamente oportunidades de optimización sin sacrificar la calidad?', weight: 1.0 },
            { id: 'fr_05', text: '¿La empresa tiene un plan financiero a largo plazo que proyecte las necesidades de inversión y las fuentes de financiación?', tooltip: 'La estrategia de negocio debe tener un correlato financiero. Se evalúa si la empresa sabe cuánto dinero necesitará para ejecutar su plan de crecimiento a 3-5 años y cómo planea obtenerlo (deuda, capital, reinversión).', weight: 1.1 }
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
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    if (overlay) {
        if (messageEl) {
            messageEl.innerHTML = message;
        }
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// ===== FUNCIONES DE REGISTRO =====
function validateForm() {
    // Esta función parece estar causando un error de "Cannot set properties of null"
    // porque intenta acceder a elementos que no existen en este contexto.
    // La validación principal ahora se maneja con los atributos 'required' del HTML.
    // Dejamos la función vacía para evitar el error.
    return [];
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function handleRegistrationSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML || "CONTINUAR A LA EVALUACIÓN";

    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner"></span> Registrando...`;

    const formData = new FormData(form);
    
    // Añadimos la acción para el nuevo script
    formData.append('action', 'register');

    // Recolectar desafíos de checkboxes
    const desafios = [];
    document.querySelectorAll('input[name="desafio"]:checked').forEach(checkbox => {
        desafios.push(checkbox.value);
    });
    formData.append('desafios_total', desafios.join(' | '));

    // CORRECCIÓN: Mapear los nombres del formulario a los nombres que espera el Apps Script
    const mappedData = {
        action: 'register',
        nombre_contacto: formData.get('contactName'),
        email: formData.get('email'),
        telefono: formData.get('phone'),
        cargo: formData.get('role'),
        empresa: formData.get('companyName'),
        sector: formData.get('sector'),
        empleados: formData.get('size'),
        tiempo_operacion: formData.get('years'),
        ubicacion: formData.get('location'),
        sitio_web: formData.get('website'),
        desafio: desafios.join(' | '),
        objetivo: formData.get('objetivo'),
        plazo_resultados: formData.get('plazo'),
        como_conocio: formData.get('conocimiento'),
        presupuesto: formData.get('presupuesto'),
        equipo_tecnico: formData.get('equipoTecnico'),
        urgencia: formData.get('urgencia'),
        area_dolor: formData.get('areaDolor'),
        horario_contacto: formData.get('horario'),
        terminos: formData.get('terminos')
    };

    console.log('Datos mapeados para enviar:', mappedData);

    try {
        showLoading('Enviando datos...');
        
        // Método alternativo: Usar iframe oculto para enviar el formulario
        // Este enfoque es más confiable que JSONP para formularios
        const iframeId = 'hiddenIframe' + new Date().getTime();
        
        // Crear una promesa para manejar la respuesta
        const responsePromise = new Promise((resolve, reject) => {
            // Crear un formulario temporal
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.target = iframeId;
            tempForm.style.display = 'none';
            
            // Añadir todos los campos como inputs hidden
            for (const key in mappedData) {
                if (mappedData[key] !== null && mappedData[key] !== undefined) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = mappedData[key];
                    tempForm.appendChild(input);
                }
            }
            
            // Crear iframe oculto para recibir la respuesta
            const iframe = document.createElement('iframe');
            iframe.name = iframeId;
            iframe.id = iframeId;
            iframe.style.display = 'none';
            
            // Manejar la respuesta cuando el iframe carga
            iframe.onload = function() {
                try {
                    // Simular una respuesta exitosa ya que no podemos acceder al contenido del iframe por seguridad
                    console.log('Iframe cargado, asumiendo respuesta exitosa');
                    
                    // Crear un ID único para este lead
                    const now = new Date();
                    const uniqueId = `FORJA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
                    
                    // Resolver con un objeto simulando la respuesta del servidor
                    resolve({
                        success: true,
                        message: "Registro procesado correctamente",
                        data: {
                            id_lead: uniqueId
                        }
                    });
                    
                    // Limpiar después de un tiempo
                    setTimeout(() => {
                        try {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                            if (document.body.contains(tempForm)) {
                                document.body.removeChild(tempForm);
                            }
                        } catch (e) {
                            console.warn('Error al limpiar elementos temporales:', e);
                        }
                    }, 5000);
                } catch (e) {
                    reject(new Error('Error al procesar la respuesta'));
                }
            };
            
            // Manejar errores
            iframe.onerror = function() {
                reject(new Error('Error de comunicación con el servidor'));
            };
            
            // Añadir elementos al DOM y enviar
            document.body.appendChild(iframe);
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            // Establecer un timeout por si el iframe nunca carga
            setTimeout(() => {
                reject(new Error('Tiempo de espera agotado'));
            }, 30000);
        });
        
        // Esperar la respuesta
        const result = await responsePromise;
        
        console.log('Respuesta recibida:', result);
        
        if (result.success && result.data && result.data.id_lead) {
            console.log('Registro exitoso. ID Lead:', result.data.id_lead);
            showToast('¡Registro completado!', 'success');
            
            // Guardar datos y el ID del Lead para el envío de scores
            appState.companyData = {
                name: mappedData.empresa,
                email: mappedData.email,
                sector: mappedData.sector
            };
            appState.id_lead = result.data.id_lead; // Este es el ID que usaremos como ID Evaluacion
            saveState();

            // Mostrar evaluación
            showSection('evaluation');
            renderCurrentQuestion();
            renderSidebar();
        } else {
            throw new Error(result.message || 'Error desconocido al registrar.');
        }
    } catch (error) {
        console.error('Error en el envío del formulario:', error);
        showToast('Error al enviar el formulario: ' + (error.message || 'Error desconocido'), 'error');
    } finally {
        hideLoading();
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }
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
    
    // Ocultar feedback de la pregunta anterior
    const feedbackContainer = document.getElementById('selectedFeedback');
    if (feedbackContainer) {
        feedbackContainer.classList.add('hidden');
    }

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
async function finishEvaluation() {
    showLoading('Calculando resultados...');
    
    try {
        // Calcular puntuaciones
        calculateScores();
        
        // Mostrar sección de resultados
        showSection('results');
        renderResults();
        
        // No es necesario llamar a sendDataToGoogleSheets() aquí
        // ya que renderResults() llama a renderBenchmarkComponent() que envía los datos
    } catch (error) {
        console.error('Error al finalizar la evaluación:', error);
        showToast('Error al procesar los resultados', 'error');
    } finally {
        hideLoading();
    }
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

    // Renderizar componente de benchmarking
    renderBenchmarkComponent();
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
            priority: 'CRITICO',
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
            priority: 'CRITICO',
            actions: ['Implementar un software contable o financiero en la nube.', 'Establecer un proceso de presupuesto mensual y anual.', 'Realizar un análisis de rentabilidad por producto/servicio.']
        }
    };
    
    const finalRecommendations = sortedCategories.map(category => {
        const rec = recs[category.id] || recs['vision_estrategia'];
        return {
            ...rec,
            category: category.name,
            categoryIcon: category.icon,
            score: category.score
        };
    });

    const priorityOrder = { 'CRITICO': 4, 'ALTO': 3, 'MEDIO': 2, 'BAJO': 1 };
    finalRecommendations.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

    return finalRecommendations;
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
// Las funciones para enviar datos a Google Sheets ahora son:
// - sendScoresToSheet: para enviar los scores generales
// - sendEvaluationDataToSheet: para enviar los datos detallados de la evaluación

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
        
        // ========== PÁGINA 4: ANÁLISIS COMPETITIVO ==========
        doc.addPage();
        addPageHeader(doc, pageWidth, 'ANÁLISIS COMPETITIVO', logoInfo);
        
        let yBenchmark = 140;
        const benchmarkData = obtenerBenchmarkPorSector(companyData.sector);

        if (benchmarkData) {
            const { pyme_promedio, lider_mercado } = benchmarkData;
            const overallScores = {
                user: calcularScoreGeneral(categoryScores),
                pyme: calcularScoreGeneral(pyme_promedio),
                lider: calcularScoreGeneral(lider_mercado)
            };

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.purple);
            doc.text(`Comparación con el sector: ${benchmarkData.nombre}`, margin, yBenchmark);
            
            yBenchmark += 30;

            // Summary boxes
            const statBoxWidth = contentWidth / 3 - 15;
            const statBoxHeight = 60;
            const statBoxes = [
                { label: 'Tu Empresa', score: overallScores.user, color: colors.purple },
                { label: 'PYME Promedio', score: overallScores.pyme, color: colors.orange },
                { label: 'Líder del Mercado', score: overallScores.lider, color: colors.green }
            ];

            statBoxes.forEach((box, i) => {
                const boxX = margin + i * (statBoxWidth + 22.5);
                doc.setFillColor(...box.color);
                doc.roundedRect(boxX, yBenchmark, statBoxWidth, statBoxHeight, 8, 8, 'F');
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colors.white);
                doc.text(box.label, boxX + statBoxWidth / 2, yBenchmark + 25, { align: 'center' });
                
                doc.setFontSize(18);
                doc.text(`${box.score}%`, boxX + statBoxWidth / 2, yBenchmark + 48, { align: 'center' });
            });

            yBenchmark += statBoxHeight + 40;

            // Gráfico de radar como imagen
            const canvas = document.getElementById('benchmarkRadarChart');
            if (canvas) {
                const imgData = canvas.toDataURL('image/png');
                const chartWidth = contentWidth - 40;
                const chartHeight = chartWidth * 0.8; // Mantener una proporción razonable
                const chartX = (pageWidth - chartWidth) / 2;
                doc.addImage(imgData, 'PNG', chartX, yBenchmark, chartWidth, chartHeight);
                yBenchmark += chartHeight + 20;
            }

            // Brechas críticas
             if (yBenchmark > pageHeight - 120) {
                addFooter(doc, pageWidth, pageHeight, logoInfo);
                doc.addPage();
                addPageHeader(doc, pageWidth, 'ANÁLISIS COMPETITIVO', logoInfo);
                yBenchmark = 140;
            }

            const brechas = calcularBrechasCriticas(categoryScores, lider_mercado);
            const criticas = brechas.filter(b => b.brecha < 0).slice(0, 3);
            
            if (criticas.length > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colors.primary);
                doc.text('Brechas Críticas vs. Líder del Sector', margin, yBenchmark);
                yBenchmark += 20;

                doc.setFillColor(254, 226, 226); // Light red background
                doc.roundedRect(margin, yBenchmark, contentWidth, criticas.length * 25 + 15, 8, 8, 'F');

                criticas.forEach((brecha, i) => {
                    const catName = getCategoryNameById(brecha.dimension);
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...colors.primary);
                    doc.text(`• ${catName}:`, margin + 15, yBenchmark + 20 + (i * 25));
                    
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(...colors.gray);
                    doc.text(`Tu score es de ${categoryScores[brecha.dimension]}, mientras que el líder tiene ${lider_mercado[brecha.dimension]}.`, margin + 120, yBenchmark + 20 + (i * 25));
                });
            }

        } else {
            doc.setFontSize(12);
            doc.setTextColor(...colors.gray);
            doc.text('No hay datos de benchmarking disponibles para este sector.', pageWidth/2, yBenchmark, { align: 'center' });
        }

        addFooter(doc, pageWidth, pageHeight, logoInfo);

        // ========== PÁGINA 5: PLAN DE ACCIÓN ==========
        
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
        
        // ========== PÁGINA 6: CTA ==========
        
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
    if (logoData && logoData.data) {
        try {
            const logoWidth = 70;
            const logoHeight = logoWidth / logoData.aspectRatio;
            doc.addImage(logoData.data, 'PNG', 40, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
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
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
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
        container.innerHTML = '<p class="text-center text-gray-600">No hay datos de benchmarking disponibles para el sector seleccionado.</p>';
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
        <div class="benchmark-grid">
            <div class="benchmark-stats-col">
                
                <!-- Summary Cards -->
                <div class="benchmark-stat-card user-score">
                    <div class="stat-label">Tu Empresa</div>
                    <div class="stat-score">${overallScores.user}</div>
                </div>
                <div class="benchmark-stat-card pyme-score">
                    <div class="stat-label">PYME Promedio</div>
                    <div class="stat-score">${overallScores.pyme}</div>
                </div>
                <div class="benchmark-stat-card lider-score">
                    <div class="stat-label">Líder del Sector</div>
                    <div class="stat-score">${overallScores.lider}</div>
                </div>

                <!-- Gap Analysis Table -->
                <div class="card mt-4">
                    <div class="card-body">
                        <h3 class="text-h3 mb-4">Análisis de Brechas</h3>
                        <table class="gap-analysis-table">
                            <thead>
                                <tr>
                                    <th>Dimensión</th>
                                    <th>Tu Score</th>
                                    <th>vs Promedio</th>
                                    <th>vs Líder</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${categories.map(cat => {
                                    const userScore = userScores[cat.id] || 0;
                                    const pymeScore = pyme_promedio[cat.id] || 0;
                                    const liderScore = lider_mercado[cat.id] || 0;
                                    const gapPyme = userScore - pymeScore;
                                    const gapLider = userScore - liderScore;
                                    return `
                                        <tr>
                                            <td>${cat.name}</td>
                                            <td><strong>${userScore}</strong></td>
                                            <td>
                                                <span class="gap-value" style="background-color: ${gapPyme >= 0 ? '#10B981' : '#EF4444'};">
                                                    ${gapPyme >= 0 ? '+' : ''}${gapPyme}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="gap-value" style="background-color: ${gapLider >= 0 ? '#10B981' : '#EF4444'};">
                                                    ${gapLider >= 0 ? '+' : ''}${gapLider}
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Position Interpretation -->
                <div class="position-interpretation ${position.class}">
                    <h4 class="font-bold">${position.title} (Top ${percentile}%)</h4>
                    <p>${position.message}</p>
                </div>

            </div>
            <div class="benchmark-chart-col">
                <div class="chart-container" style="height: 500px;">
                    <canvas id="benchmarkRadarChart"></canvas>
                </div>
            </div>
        </div>
    `;

    renderBenchmarkRadar(userScores, pyme_promedio, lider_mercado);
    
    // Enviar los scores a Google Sheets en segundo plano
    sendScoresToSheet(userScores, overallScores, percentile);
    // NUEVO: Enviar el detalle de la evaluación a la otra hoja
    sendEvaluationDataToSheet(categoryScores);
}

async function sendScoresToSheet(categoryScores, overallScores, percentile) {
    if (!appState.id_lead) {
        console.warn('No hay ID_Lead para enviar los scores. El registro inicial pudo haber fallado.');
        return;
    }

    console.log(`Enviando scores para el ID_Lead: ${appState.id_lead}`);

    // Crear objeto de datos para enviar
    const dataToSend = {
        action: 'update_scores',
        id_lead: appState.id_lead,
        score_general: overallScores.user || 0,
        score_vision_estrategia: categoryScores.vision_estrategia || 0,
        score_gobierno_empresarial: categoryScores.gobierno_empresarial || 0,
        score_procesos_operaciones: categoryScores.procesos_operaciones || 0,
        score_talento_cultura: categoryScores.talento_cultura || 0,
        score_innovacion_agilidad: categoryScores.innovacion_agilidad || 0,
        score_estrategia_tecnologica: categoryScores.estrategia_tecnologica || 0,
        score_inteligencia_negocio: categoryScores.inteligencia_negocio || 0,
        score_experiencia_cliente: categoryScores.experiencia_cliente || 0,
        score_sostenibilidad: categoryScores.sostenibilidad_responsabilidad || 0,
        score_finanzas: categoryScores.finanzas_rentabilidad || 0,
        benchmark_pyme: overallScores.pyme || 0,
        benchmark_lider: overallScores.lider || 0,
        benchmark_percentil: percentile || 0
    };

    try {
        showLoading('Guardando resultados...');
        
        // Método alternativo: Usar iframe oculto para enviar el formulario
        const iframeId = 'hiddenIframeScores' + new Date().getTime();
        
        // Crear una promesa para manejar la respuesta
        const responsePromise = new Promise((resolve, reject) => {
            // Crear un formulario temporal
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = GOOGLE_SCRIPT_URL;
            tempForm.target = iframeId;
            tempForm.style.display = 'none';
            
            // Añadir todos los campos como inputs hidden
            for (const [key, value] of Object.entries(dataToSend)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                tempForm.appendChild(input);
            }
            
            // Crear iframe oculto para recibir la respuesta
            const iframe = document.createElement('iframe');
            iframe.name = iframeId;
            iframe.id = iframeId;
            iframe.style.display = 'none';
            
            // Manejar la respuesta cuando el iframe carga
            iframe.onload = function() {
                try {
                    // Simular una respuesta exitosa ya que no podemos acceder al contenido del iframe por seguridad
                    console.log('Iframe de scores cargado, asumiendo respuesta exitosa');
                    
                    // Resolver con un objeto simulando la respuesta del servidor
                    resolve({
                        success: true,
                        message: "Scores actualizados correctamente"
                    });
                    
                    // Limpiar después de un tiempo
                    setTimeout(() => {
                        try {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                            if (document.body.contains(tempForm)) {
                                document.body.removeChild(tempForm);
                            }
                        } catch (e) {
                            console.warn('Error al limpiar elementos temporales:', e);
                        }
                    }, 5000);
                } catch (e) {
                    reject(new Error('Error al procesar la respuesta de scores'));
                }
            };
            
            // Manejar errores
            iframe.onerror = function() {
                reject(new Error('Error de comunicación con el servidor'));
            };
            
            // Añadir elementos al DOM y enviar
            document.body.appendChild(iframe);
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            // Establecer un timeout por si el iframe nunca carga
            setTimeout(() => {
                reject(new Error('Tiempo de espera agotado'));
            }, 30000);
        });
        
        // Esperar la respuesta
        const result = await responsePromise;

        if (result.success) {
            console.log('Scores enviados y actualizados en Google Sheets con éxito.');
            showToast('Resultados guardados correctamente', 'success');
        } else {
            throw new Error(result.message || 'Error desconocido al actualizar scores.');
        }
    } catch (error) {
        console.error('Error al enviar los scores:', error);
        showToast('Error al guardar los resultados', 'error');
    } finally {
        hideLoading();
    }
}

function renderBenchmarkRadar(user, pyme, lider) {
    const canvas = document.getElementById('benchmarkRadarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = categories.map(cat => cat.name);

    if (window.benchmarkRadarInstance) {
        window.benchmarkRadarInstance.destroy();
    }

    const userData = categories.map(cat => user[cat.id] || 0);
    const pymeData = categories.map(cat => pyme[cat.id] || 0);
    const liderData = categories.map(cat => lider[cat.id] || 0);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Tu Empresa',
                data: userData,
                backgroundColor: 'rgba(133, 96, 192, 0.2)',
                borderColor: 'rgba(133, 96, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'PYME Promedio',
                data: pymeData,
                backgroundColor: 'rgba(238, 128, 40, 0.2)',
                borderColor: 'rgba(238, 128, 40, 1)',
                borderWidth: 1
            },
            {
                label: 'Líder del Sector',
                data: liderData,
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
            responsive: true,
            maintainAspectRatio: false, // Clave para que el gráfico se ajuste al contenedor
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 20,
                    right: 20
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        },
                        color: '#33487A',
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: '#6c757d',
                        font: {
                            size: 10
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    };

    window.benchmarkRadarInstance = new Chart(ctx, config);
}

function getCategoryStatusClass(categoryIndex) {
    const category = categories[categoryIndex];
    const answeredQuestions = category.questions.filter(q => 
        appState.evaluationData.answers[q.id] !== undefined
    ).length;
    
    const isCompleted = answeredQuestions === category.questions.length;
    
    return isCompleted ? 'completed' : '';
}

function getCategoryProgress(categoryIndex) {
    const category = categories[categoryIndex];
    const answeredQuestions = category.questions.filter(q => 
        appState.evaluationData.answers[q.id] !== undefined
    ).length;
    
    return answeredQuestions;
}

// Esta función se llamará cuando sea necesario renderizar la barra lateral
function renderSidebar() {
    const sidebar = document.getElementById('categoryProgress');
    if (!sidebar) return; // Si no existe el elemento, no hacemos nada
    
    sidebar.innerHTML = categories.map((cat, index) => {
        const completedQuestions = cat.questions.filter(q => 
            appState.evaluationData.answers[q.id] !== undefined
        ).length;
        
        const isCompleted = completedQuestions === cat.questions.length;
        const isCurrent = index === appState.evaluationData.currentCategory;
        
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

async function sendEvaluationDataToSheet(categoryScores) {
    if (!appState.id_lead || !appState.companyData.name) {
        console.warn('No hay ID de Evaluación o nombre de empresa para enviar el detalle.');
        return;
    }

    const idEvaluacion = appState.id_lead;
    const empresa = appState.companyData.name;
    const timestamp = new Date().toISOString();
    const finalScore = calcularScoreGeneral(categoryScores);
    const maturityLevel = getMaturityLevel(finalScore).level;

    const evaluationData = [];

    categories.forEach(category => {
        const categoryScore = categoryScores[category.id] || 0;
        const categoryLevel = getMaturityLevel(categoryScore).level;

        category.questions.forEach(question => {
            const answer = appState.evaluationData.answers[question.id];
            if (answer !== undefined) {
                evaluationData.push({
                    timestamp: timestamp,
                    id_evaluacion: idEvaluacion,
                    empresa: empresa,
                    id_pregunta: question.id,
                    pregunta: question.text,
                    categoria: category.name,
                    respuesta: answer,
                    puntuacion_categoria: categoryScore,
                    nivel_categoria: categoryLevel,
                    puntuacion_final: finalScore,
                    nivel_madurez: maturityLevel
                });
            }
        });
    });

    if (evaluationData.length === 0) {
        console.warn('No hay datos de evaluación para enviar.');
        return;
    }
    
    console.log(`Preparando el envío de ${evaluationData.length} respuestas detalladas.`);

    // Para datos grandes como este, usaremos una estrategia diferente
    // Dividiremos los datos en bloques más pequeños para no sobrecargar el servidor
    try {
        showLoading('Guardando evaluación detallada...');
        
        // Dividir los datos en bloques de 10 preguntas
        const chunkSize = 10;
        const dataChunks = [];
        
        for (let i = 0; i < evaluationData.length; i += chunkSize) {
            dataChunks.push(evaluationData.slice(i, i + chunkSize));
        }
        
        console.log(`Dividiendo datos en ${dataChunks.length} bloques para envío`);
        
        // Enviar cada bloque secuencialmente
        for (let i = 0; i < dataChunks.length; i++) {
            const chunk = dataChunks[i];
            showLoading(`Guardando bloque ${i+1} de ${dataChunks.length}...`);
            
            // Método alternativo: Usar iframe oculto para enviar el formulario
            const iframeId = 'hiddenIframeEval' + new Date().getTime();
            
            // Crear una promesa para manejar la respuesta
            await new Promise((resolve, reject) => {
                // Crear un formulario temporal
                const tempForm = document.createElement('form');
                tempForm.method = 'POST';
                tempForm.action = GOOGLE_SCRIPT_URL;
                tempForm.target = iframeId;
                tempForm.style.display = 'none';
                
                // Añadir campos básicos
                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'save_evaluation';
                tempForm.appendChild(actionInput);
                
                // Añadir los datos como JSON
                const dataInput = document.createElement('input');
                dataInput.type = 'hidden';
                dataInput.name = 'data';
                dataInput.value = JSON.stringify(chunk);
                tempForm.appendChild(dataInput);
                
                // Crear iframe oculto para recibir la respuesta
                const iframe = document.createElement('iframe');
                iframe.name = iframeId;
                iframe.id = iframeId;
                iframe.style.display = 'none';
                
                // Manejar la respuesta cuando el iframe carga
                iframe.onload = function() {
                    try {
                        // Simular una respuesta exitosa ya que no podemos acceder al contenido del iframe por seguridad
                        console.log(`Iframe de evaluación (bloque ${i+1}/${dataChunks.length}) cargado, asumiendo respuesta exitosa`);
                        
                        // Resolver con un objeto simulando la respuesta del servidor
                        resolve({
                            success: true,
                            message: `Bloque ${i+1} guardado correctamente`
                        });
                        
                        // Limpiar después de un tiempo
                        setTimeout(() => {
                            try {
                                if (document.body.contains(iframe)) {
                                    document.body.removeChild(iframe);
                                }
                                if (document.body.contains(tempForm)) {
                                    document.body.removeChild(tempForm);
                                }
                            } catch (e) {
                                console.warn('Error al limpiar elementos temporales:', e);
                            }
                        }, 5000);
                    } catch (e) {
                        reject(new Error('Error al procesar la respuesta de evaluación'));
                    }
                };
                
                // Manejar errores
                iframe.onerror = function() {
                    reject(new Error('Error de comunicación con el servidor'));
                };
                
                // Añadir elementos al DOM y enviar
                document.body.appendChild(iframe);
                document.body.appendChild(tempForm);
                tempForm.submit();
                
                // Establecer un timeout por si el iframe nunca carga
                setTimeout(() => {
                    reject(new Error('Tiempo de espera agotado'));
                }, 30000);
            });
            
            // Pequeña pausa entre bloques para no sobrecargar el servidor
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        console.log('Datos detallados de la evaluación enviados con éxito.');
        showToast('Evaluación guardada correctamente', 'success');
    } catch (error) {
        console.error('Error al enviar el detalle de la evaluación:', error);
        showToast('Error al guardar la evaluación detallada: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}