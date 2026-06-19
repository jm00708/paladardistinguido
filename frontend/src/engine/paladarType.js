// Mirror of engine/paladar_type.py — classify without hitting the backend
const TYPES = [
  { key: 'tanico_robusto',    name: 'El Tánico Robusto',    icon: '◼', vector: [0.85, 0.45, 0.88, 0.15, 0.30, 0.40] },
  { key: 'aficionado_fresco', name: 'El Aficionado Fresco', icon: '◇', vector: [0.30, 0.88, 0.22, 0.15, 0.45, 0.55] },
  { key: 'mineral_puro',      name: 'El Mineral Puro',      icon: '◈', vector: [0.40, 0.75, 0.28, 0.10, 0.50, 0.92] },
  { key: 'marino',            name: 'El Marino',            icon: '≋', vector: [0.38, 0.65, 0.25, 0.18, 0.88, 0.68] },
  { key: 'hedonista',         name: 'El Hedonista',         icon: '❧', vector: [0.80, 0.38, 0.52, 0.48, 0.22, 0.28] },
  { key: 'gourmand',          name: 'El Gourmand',          icon: '✦', vector: [0.58, 0.28, 0.22, 0.80, 0.18, 0.25] },
  { key: 'equilibrado',       name: 'El Equilibrado',       icon: '⊙', vector: [0.50, 0.50, 0.50, 0.40, 0.45, 0.45] },
  { key: 'explorador',        name: 'El Explorador',        icon: '✈', vector: [0.50, 0.50, 0.50, 0.50, 0.50, 0.50] },
]

function euclidean(v1, v2) {
  return Math.sqrt(v1.reduce((sum, a, i) => sum + (a - v2[i]) ** 2, 0))
}

/**
 * Clasifica un vector sensorial de 6 dimensiones en uno de los 8 arquetipos.
 * @param {number[]} vector [body, acidity, tannins, sweetness, salinity, minerality]
 * @returns {{ key, name, icon }}
 */
export function classifyPaladar(vector) {
  const known = vector.filter(v => v != null)
  if (known.length < 2) return TYPES.find(t => t.key === 'explorador')
  const filled = vector.map(v => v ?? 0.5)
  return TYPES.reduce((best, t) =>
    euclidean(filled, t.vector) < euclidean(filled, best.vector) ? t : best
  )
}
