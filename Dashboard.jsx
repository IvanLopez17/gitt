import { useEffect, useState, useContext } from 'react';
import { fetchVentas, addVenta, deleteVenta, updateVenta, fetchReportes } from '../services/api';
import { UserContext } from '../context/UserContext';

export default function Dashboard() {
  const { user, token, logout } = useContext(UserContext);
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ fecha_venta: '', codigo_reserva: '', cliente: '', total_venta: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const cargarVentas = async () => {
    const res = await fetchVentas(token);
    setVentas(res.data.ventas);
    setTotal(res.data.ventas.reduce((sum, v) => sum + v.total_venta, 0));
  };

  useEffect(() => { cargarVentas(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await addVenta(form, token);
      setMsg('Venta registrada');
      setError('');
      setForm({ fecha_venta: '', codigo_reserva: '', cliente: '', total_venta: '' });
      cargarVentas();
    } catch (e) {
      setError(e.response?.data?.message || 'Error al registrar venta');
    }
  };

  return (
    <div>
      <header>
        {user.image && <img src={user.image} alt="Perfil" width={48} />}
        <h2>Bienvenido, {user.name} ({user.role})</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <h3>Total ventas: ${total}</h3>

      <form onSubmit={handleAdd}>
        <h4>Registrar Venta</h4>
        <input type="date" name="fecha_venta" value={form.fecha_venta} onChange={handleChange} required />
        <input name="codigo_reserva" placeholder="Código de reserva" value={form.codigo_reserva} onChange={handleChange} required />
        <input name="cliente" placeholder="Cliente" value={form.cliente} onChange={handleChange} required />
        <input type="number" name="total_venta" placeholder="Total venta" value={form.total_venta} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h4>Ventas registradas</h4>
      <table>
        <thead>
          <tr>
            <th>Fecha Venta</th>
            <th>Código</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Comisión</th>
            <th>Asesor</th>
            {user.role === 'ADMIN' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.fecha_venta}</td>
              <td>{v.codigo_reserva}</td>
              <td>{v.cliente}</td>
              <td>${v.total_venta}</td>
              <td>${v.comision}</td>
              <td>{v.asesor?.name}</td>
              {user.role === 'ADMIN' && (
                <td>
                  <button onClick={() => { deleteVenta(v.id, token).then(cargarVentas); }}>Eliminar</button>
                  {/* Puedes agregar edición aquí */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}