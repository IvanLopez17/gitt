import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'Usuario no válido' });
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN')
    return res.status(403).json({ message: 'Solo ADMIN puede realizar esta acción' });
  next();
};

export const isAsesor = (req, res, next) => {
  if (req.user.role !== 'ASESOR' && req.user.role !== 'ADMIN')
    return res.status(403).json({ message: 'Solo ASESOR puede realizar esta acción' });
  next();
};