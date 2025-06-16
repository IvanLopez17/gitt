import { useState, useContext } from 'react';
import { login } from '../services/api';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '', role: 'ASESOR' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await login(data);
      setUser(res.data.user);
      setToken(res.data.token);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>🌍 Agencia de Viajes</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
          Iniciar sesión en el sistema
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="form-input"
              name="email" 
              type="email"
              placeholder="Correo electrónico" 
              value={data.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              className="form-input"
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              value={data.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <select 
              className="form-select"
              name="role" 
              value={data.role} 
              onChange={handleChange}
            >
              <option value="ASESOR">Asesor de Ventas</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <button 
            className="btn-primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
            ¿No tienes cuenta? <Link to="/register" className="link">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}