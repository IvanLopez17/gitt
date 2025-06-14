import { useState, useContext } from 'react';
import { login } from '../services/api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '', role: 'ASESOR' });
  const [error, setError] = useState('');
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(data);
      setUser(res.data.user);
      setToken(res.data.token);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={data.password} onChange={handleChange} required />
      <select name="role" value={data.role} onChange={handleChange}>
        <option value="ADMIN">ADMIN</option>
        <option value="ASESOR">ASESOR</option>
      </select>
      <button type="submit">Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
    </form>
  );
}