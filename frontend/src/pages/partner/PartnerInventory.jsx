import { useEffect, useState, useMemo } from 'react'
import { getInventory, updateInventoryItem } from '../../api/partner'
import { IconSearch, IconPencil, IconCheck, IconX } from './icons'
import './Partner.css'

const WINE_TYPE_LABELS = {
  tinto:    'Tinto',
  blanco:   'Blanco',
  rosado:   'Rosado',
  espumoso: 'Espumoso',
  dulce:    'Dulce',
  jerez:    'Jerez',
}

function WineTypeBadge({ type }) {
  const label = WINE_TYPE_LABELS[type] || type || '—'
  const cls = type ? `p-badge p-badge--${type}` : 'p-badge p-badge--default'
  return <span className={cls}>{label}</span>
}

function InventoryRow({ item, onUpdate }) {
  const [editing, setEditing]  = useState(false)
  const [glass, setGlass]      = useState(item.price_glass ?? '')
  const [bottle, setBottle]    = useState(item.price_bottle ?? '')
  const [saving, setSaving]    = useState(false)
  const [localAvail, setLocalAvail] = useState(item.available)

  const wine = item.wine_display || {}
  const wineName = wine.name || `Vino #${item.wine_id}`

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateInventoryItem(item.id, {
        price_glass:  glass === '' ? null : parseFloat(glass),
        price_bottle: bottle === '' ? null : parseFloat(bottle),
      })
      onUpdate(updated)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setGlass(item.price_glass ?? '')
    setBottle(item.price_bottle ?? '')
    setEditing(false)
  }

  const handleToggle = async (e) => {
    const newVal = e.target.checked
    setLocalAvail(newVal)
    try {
      const updated = await updateInventoryItem(item.id, { available: newVal })
      onUpdate(updated)
    } catch {
      setLocalAvail(!newVal)
    }
  }

  const fmt = (v) => v != null ? `$${parseFloat(v).toLocaleString('es-MX')}` : '—'

  return (
    <tr>
      <td>
        <p className="p-table__wine-name">{wineName}</p>
        {wine.winery && <p className="p-table__muted">{wine.winery}</p>}
      </td>
      <td>
        <WineTypeBadge type={wine.wine_type} />
      </td>
      <td>
        {editing ? (
          <input
            className="p-price-input"
            type="number"
            min="0"
            step="10"
            value={glass}
            onChange={e => setGlass(e.target.value)}
            placeholder="—"
            autoFocus
          />
        ) : (
          <span>{fmt(item.price_glass)}</span>
        )}
      </td>
      <td>
        {editing ? (
          <input
            className="p-price-input"
            type="number"
            min="0"
            step="10"
            value={bottle}
            onChange={e => setBottle(e.target.value)}
            placeholder="—"
          />
        ) : (
          <span>{fmt(item.price_bottle)}</span>
        )}
      </td>
      <td>
        <label className="p-toggle">
          <input
            type="checkbox"
            checked={localAvail}
            onChange={handleToggle}
          />
          <span className="p-toggle__track" />
        </label>
      </td>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="p-btn p-btn--primary" onClick={handleSave} disabled={saving}>
              <IconCheck width={13} height={13} />
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
            <button className="p-btn p-btn--secondary" onClick={handleCancel} disabled={saving}>
              <IconX width={13} height={13} />
            </button>
          </div>
        ) : (
          <button className="p-btn p-btn--secondary" onClick={() => setEditing(true)}>
            <IconPencil width={13} height={13} />
            Editar
          </button>
        )}
      </td>
    </tr>
  )
}

export default function PartnerInventory() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getInventory()
      .then(data => setItems(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError('No se pudo cargar el inventario.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(item => {
      const name = item.wine_display?.name?.toLowerCase() ?? ''
      const winery = item.wine_display?.winery?.toLowerCase() ?? ''
      return name.includes(q) || winery.includes(q)
    })
  }, [items, search])

  const handleUpdate = (updated) => {
    setItems(prev => prev.map(it => it.id === updated.id ? { ...it, ...updated } : it))
  }

  const available = items.filter(i => i.available).length

  if (loading) return <div className="p-loading">Cargando inventario…</div>
  if (error)   return <div className="p-alert p-alert--error">{error}</div>

  return (
    <div>
      <div className="p-page-header">
        <h1 className="p-page-header__title">Gestión de Inventario</h1>
        <p className="p-page-header__sub">Disponibilidad y precios de tu carta de vinos</p>
      </div>

      {/* Summary row */}
      <div className="p-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(150px, 220px))' }}>
        <div className="p-kpi">
          <p className="p-kpi__label">Total en carta</p>
          <p className="p-kpi__value" style={{ marginTop: 10 }}>{items.length}</p>
        </div>
        <div className="p-kpi">
          <p className="p-kpi__label">Disponibles</p>
          <p className="p-kpi__value" style={{ marginTop: 10, color: 'var(--p-success)' }}>{available}</p>
        </div>
        <div className="p-kpi">
          <p className="p-kpi__label">No disponibles</p>
          <p className="p-kpi__value" style={{ marginTop: 10 }}>{items.length - available}</p>
        </div>
      </div>

      <div className="p-card p-section">
        <div className="p-card-header">
          <span className="p-card-header__title">Carta de vinos</span>
          <div className="p-search">
            <span className="p-search__icon"><IconSearch width={15} height={15} /></span>
            <input
              className="p-search__input"
              placeholder="Buscar vino o bodega…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Vino</th>
                <th>Tipo</th>
                <th>Copa (MXN)</th>
                <th>Botella (MXN)</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="p-empty">
                      {search ? 'Sin resultados para tu búsqueda.' : 'No hay vinos en el inventario.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <InventoryRow key={item.id} item={item} onUpdate={handleUpdate} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
