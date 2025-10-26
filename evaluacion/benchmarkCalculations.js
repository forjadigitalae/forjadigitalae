/**
 * ============================================
 * ARCHIVO DE CÁLCULOS PARA BENCHMARKING
 * ============================================
 * 
 * Contiene las funciones auxiliares para procesar y comparar
 * los resultados de la evaluación contra los benchmarks sectoriales.
 */

/**
 * Calcula el score general promediando las dimensiones.
 * @param {object} scores - Objeto con los scores de cada dimensión.
 * @returns {number} - El score general redondeado.
 */
function calcularScoreGeneral(scores) {
  if (!scores) return 0;
  const validScores = Object.values(scores).filter(s => typeof s === 'number');
  if (validScores.length === 0) return 0;
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / validScores.length);
}

/**
 * Calcula el percentil de mercado de la empresa.
 * @param {number} valorEmpresa - El score general de la empresa.
 * @param {number} valorPromedio - El score promedio de las PYMEs del sector.
 * @param {number} valorLider - El score del líder del sector.
 * @returns {number} - El percentil aproximado (e.g., 10 para Top 10%).
 */
function calcularPercentil(valorEmpresa, valorPromedio, valorLider) {
  if (valorEmpresa >= valorLider) return 10;
  if (valorEmpresa <= valorPromedio) {
    const posicionRelativa = (valorEmpresa / valorPromedio) * 50;
    return Math.max(51, 100 - Math.round(posicionRelativa));
  }
  const rangoSuperior = valorLider - valorPromedio;
  const posicionEnRango = (valorEmpresa - valorPromedio) / rangoSuperior;
  return 50 - Math.round(posicionEnRango * 39); // Mapea a un rango entre 49 y 11
}


/**
 * Determina la posición en el mercado y un mensaje asociado basado en el percentil.
 * @param {number} percentil - El percentil de la empresa (1-100).
 * @returns {object} - Objeto con título, clase CSS y mensaje.
 */
function obtenerPosicionMercado(percentil) {
    if (percentil <= 10) return { title: 'Líder del Sector', class: 'pos-lider', message: '¡Felicidades! Tu empresa se encuentra en el selecto grupo de líderes del mercado, marcando la pauta en tu sector.' };
    if (percentil <= 25) return { title: 'Competidor Fuerte', class: 'pos-fuerte', message: 'Tu empresa tiene un desempeño sobresaliente y se posiciona como un competidor fuerte, muy por encima del promedio.' };
    if (percentil <= 50) return { title: 'En Desarrollo', class: 'pos-desarrollo', message: 'Tu desempeño es superior al de la mitad del mercado. Tienes una base sólida para convertirte en un competidor fuerte.' };
    return { title: 'Necesita Mejora', class: 'pos-mejora', message: 'Tu empresa se encuentra por debajo del promedio del sector, lo que indica que existen oportunidades claras para mejorar y ganar competitividad.' };
}

/**
 * Identifica y prioriza las brechas competitivas vs. el líder del mercado.
 * @param {object} resultadosEmpresa - Scores de la empresa por dimensión.
 * @param {object} benchmarkLider - Scores del líder del mercado.
 * @returns {Array} - Un array de objetos con las brechas, ordenadas por criticidad.
 */
function calcularBrechasCriticas(resultadosEmpresa, benchmarkLider) {
  return Object.keys(resultadosEmpresa).map(dimension => {
    const scoreEmpresa = resultadosEmpresa[dimension] || 0;
    const scoreLider = benchmarkLider[dimension] || 0;
    const brecha = scoreEmpresa - scoreLider;
    
    let prioridad;
    if (brecha <= -40) {
      prioridad = 'Alta';
    } else if (brecha <= -20) {
      prioridad = 'Media';
    } else {
      prioridad = 'Baja';
    }

    return { dimension, brecha, prioridad };
  }).sort((a, b) => a.brecha - b.brecha); // Ordena de la brecha más negativa a la menos
}

/**
 * Genera recomendaciones contextuales basadas en las brechas.
 * @param {Array} brechas - El array de brechas críticas.
 * @param {string} sector - El sector de la empresa.
 * @returns {object} - Un objeto con quick wins e iniciativas estratégicas.
 */
function generarRecomendacionesPorSector(brechas, sector) {
  // Esta es una implementación de ejemplo, puede ser expandida
  const recomendaciones = {
    quick_wins: [],
    iniciativas_estrategicas: []
  };

  const dbRecomendaciones = {
    vision_estrategia: { win: "Comunicar la visión en una reunión general.", strat: "Realizar un taller de planificación estratégica." },
    procesos_operaciones: { win: "Mapear un proceso clave en un diagrama de flujo.", strat: "Evaluar la implementación de un software de automatización (RPA/BPM)." },
    talento_cultura: { win: "Lanzar una encuesta de clima laboral.", strat: "Diseñar un plan de carrera para roles clave." },
    experiencia_cliente: { win: "Implementar una encuesta de NPS después de una compra.", strat: "Crear un mapa del 'Customer Journey'." },
    finanzas_rentabilidad: { win: "Revisar y optimizar los 3 mayores costos operativos.", strat: "Implementar un dashboard financiero en tiempo real." }
    // Se pueden agregar más dimensiones
  };

  brechas.slice(0, 2).forEach(brecha => {
    const rec = dbRecomendaciones[brecha.dimension];
    if (rec) {
      recomendaciones.quick_wins.push(rec.win);
      recomendaciones.iniciativas_estrategicas.push(rec.strat);
    }
  });

  return recomendaciones;
}

/**
 * Retorna un color HEX basado en un score.
 * @param {number} score - La puntuación (0-100).
 * @returns {string} - El código de color HEX.
 */
function obtenerColorPorScore(score) {
  if (score <= 40) return '#EF4444'; // Rojo
  if (score <= 60) return '#F97316'; // Naranja
  if (score <= 80) return '#10B981'; // Verde
  return '#3B82F6'; // Azul
}

/**
 * Obtiene los datos de benchmark para un sector dado, con fallback.
 * @param {string} sectorUsuario - El nombre del sector seleccionado por el usuario.
 * @returns {object} - Los datos de benchmark para el sector correspondiente.
 */
function obtenerBenchmarkPorSector(sectorUsuario) {
    const sectorMapping = {
        'Tecnología': 'servicios_profesionales',
        'Retail/Comercio': 'comercio_ecommerce',
        'Manufactura': 'manufactura',
        'Servicios': 'servicios_profesionales',
        'Salud': 'servicios_salud',
        'Educación': 'servicios_profesionales', 
        'Construcción': 'manufactura',
        'Alimentos': 'agroindustria',
        'Logística': 'manufactura',
        'Otro': 'servicios_profesionales' 
    };

    const sectorKey = sectorMapping[sectorUsuario] || 'servicios_profesionales';
    return BENCHMARKS_SECTORIALES[sectorKey];
}
