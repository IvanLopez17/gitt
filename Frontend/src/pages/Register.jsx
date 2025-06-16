import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [data, setData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'ASESOR',
    image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register(data);
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>🌍 Registro de Usuario</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
          Crear nueva cuenta en el sistema
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              className="form-input"
              name="name" 
              placeholder="Nombre completo" 
              value={data.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
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
            <input 
              className="form-input"
              name="image" 
              type="url"
              placeholder="URL de imagen de perfil (opcional)" 
              value={data.image} 
              onChange={handleChange} 
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
            {loading ? 'Registrando...' : 'Registrar Usuario'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
            ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}