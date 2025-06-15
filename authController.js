import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, image });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user.id, name, email, role, image } });
  } catch (e) {
    res.status(400).json({ message: 'Error al registrar', error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ where: { email, role } });
    if (!user) return res.status(400).json({ message: 'Usuario o rol incorrecto' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image } });
  } catch (e) {
    res.status(500).json({ message: 'Error en login', error: e.message });
  }
};