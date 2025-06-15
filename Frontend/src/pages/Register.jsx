import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'ASESOR' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(data);
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="name" placeholder="Nombre" value={data.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={data.password} onChange={handleChange} required />
      <select name="role" value={data.role} onChange={handleChange}>
        <option value="ADMIN">ADMIN</option>
        <option value="ASESOR">ASESOR</option>
      </select>
      <button type="submit">Registrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}