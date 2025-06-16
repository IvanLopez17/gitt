import { useEffect, useState, useContext } from 'react';
import { fetchVentas, addVenta, deleteVenta, updateVenta, fetchReportes } from '../services/api';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const { user, token, logout } = useContext(UserContext);
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalComision, setTotalComision] = useState(0);
  const [form, setForm] = useState({ 
    fecha_venta: '', 
    codigo_reserva: '', 
    cliente: '', 
    total_venta: '' 
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarVentas = async () => {
    try {
      const res = await fetchVentas(token);
      setVentas(res.data.ventas);
      const totalVentas = res.data.ventas.reduce((sum, v) => sum + parseFloat(v.total_venta), 0);
      const totalComisiones = res.data.ventas.reduce((sum, v) => sum + parseFloat(v.comision), 0);
      setTotal(totalVentas);
      setTotalComision(totalComisiones);
    } catch (error) {
      setError('Error al cargar las ventas');
    }
  };

  useEffect(() => { 
    cargarVentas(); 
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    
    try {
      await addVenta(form, token);
      setMsg('Venta registrada exitosamente');
      setForm({ fecha_venta: '', codigo_reserva: '', cliente: '', total_venta: '' });
      cargarVentas();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Error al registrar venta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      try {
        await deleteVenta(id, token);
        setMsg('Venta eliminada exitosamente');
        cargarVentas();
        setTimeout(() => setMsg(''), 3000);
      } catch (error) {
        setError('Error al eliminar la venta');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          {user.image && (
            <img 
              src={user.image} 
              alt="Perfil" 
              className="user-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="user-details">
            <h2>Bienvenido, {user.name}</h2>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button className="btn-secondary" onClick={logout}>
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-content">
        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stats-card">
            <h3>Total en Ventas</h3>
            <div className="stats-amount">{formatCurrency(total)}</div>
          </div>
          <div className="stats-card">
            <h3>Total en Comisiones</h3>
            <div className="stats-amount">{formatCurrency(totalComision)}</div>
          </div>
          <div className="stats-card">
            <h3>Número de Ventas</h3>
            <div className="stats-amount">{ventas.length}</div>
          </div>
        </div>

        {/* Formulario de registro */}
        {(user.role === 'ASESOR' || user.role === 'ADMIN') && (
          <div className="form-section">
            <h4>📝 Registrar Nueva Venta</h4>
            <form onSubmit={handleAdd}>
              <div className="form-row">
                <input 
                  className="form-input"
                  type="date" 
                  name="fecha_venta" 
                  value={form.fecha_venta} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  className="form-input"
                  name="codigo_reserva" 
                  placeholder="Código de reserva" 
                  value={form.codigo_reserva} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-row">
                <input 
                  className="form-input"
                  name="cliente" 
                  placeholder="Nombre del cliente" 
                  value={form.cliente} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  className="form-input"
                  type="number" 
                  name="total_venta" 
                  placeholder="Total de la venta" 
                  value={form.total_venta} 
                  onChange={handleChange} 
                  min="0"
                  step="0.01"
                  required 
                />
              </div>
              <button 
                className="btn-primary" 
                type="submit" 
                disabled={loading}
                style={{ width: 'auto', padding: '12px 24px' }}
              >
                {loading ? 'Registrando...' : '💾 Registrar Venta'}
              </button>
            </form>
            
            {msg && <div className="success-message">{msg}</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {/* Tabla de ventas */}
        <div className="table-container">
          <h4 style={{ padding: '1.5rem 1.5rem 0', color: '#333' }}>
            📊 Ventas Registradas
          </h4>
          
          {ventas.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              No hay ventas registradas
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha de Venta</th>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Comisión</th>
                  <th>Asesor</th>
                  {user.role === 'ADMIN' && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {ventas.map(venta => (
                  <tr key={venta.id}>
                    <td>{formatDate(venta.fecha_venta)}</td>
                    <td>
                      <code style={{ 
                        background: '#f8f9fa', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontSize: '0.9em'
                      }}>
                        {venta.codigo_reserva}
                      </code>
                    </td>
                    <td>{venta.cliente}</td>
                    <td style={{ fontWeight: '600', color: '#28a745' }}>
                      {formatCurrency(venta.total_venta)}
                    </td>
                    <td style={{ fontWeight: '600', color: '#667eea' }}>
                      {formatCurrency(venta.comision)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {venta.asesor?.image && (
                          <img 
                            src={venta.asesor.image} 
                            alt="Asesor" 
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        {venta.asesor?.name || 'N/A'}
                      </div>
                    </td>
                    {user.role === 'ADMIN' && (
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-danger"
                            onClick={() => handleDelete(venta.id)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}