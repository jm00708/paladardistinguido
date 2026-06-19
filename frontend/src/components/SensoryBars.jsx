const DIMENSIONS = [
  { key: 'body',        label: 'Cuerpo' },
  { key: 'acidity',    label: 'Acidez' },
  { key: 'tannins',    label: 'Taninos' },
  { key: 'sweetness',  label: 'Dulzor' },
  { key: 'salinity',   label: 'Salinidad' },
  { key: 'minerality', label: 'Mineralidad' },
]

export default function SensoryBars({ sensory, showAll = false }) {
  const dims = showAll ? DIMENSIONS : DIMENSIONS.slice(0, 4)

  return (
    <div className="sensory-bar">
      {dims.map(({ key, label }) => {
        const val = sensory?.[key] ?? 0
        return (
          <div key={key} className="sensory-bar__row">
            <span className="sensory-bar__label">{label}</span>
            <div className="sensory-bar__track">
              <div className="sensory-bar__fill" style={{ width: `${val * 100}%` }} />
            </div>
            <span className="sensory-bar__value">{Math.round(val * 100)}%</span>
          </div>
        )
      })}
    </div>
  )
}
