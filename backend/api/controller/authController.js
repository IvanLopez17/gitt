import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;
    
    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: role || 'ASESOR', 
      image 
    });
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        image: user.image 
      } 
    });
  } catch (e) {
    console.error('Error al registrar usuario:', e);
    res.status(400).json({ message: 'Error al registrar', error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    const user = await User.findOne({ where: { email, role } });
    if (!user) {
      return res.status(400).json({ message: 'Usuario o rol incorrecto' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '12h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        image: user.image 
      } 
    });
  } catch (e) {
    console.error('Error en login:', e);
    res.status(500).json({ message: 'Error en login', error: e.message });
  }
};