import express from 'express';
import {
  getVentas,
  addVenta,
  updateVenta,
  deleteVenta,
  getReportes
} from '../controllers/ventasController.js';
import { authMiddleware, isAdmin, isAsesor } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getVentas);
router.post('/', authMiddleware, isAsesor, addVenta);
router.put('/:id', authMiddleware, isAdmin, updateVenta);
router.delete('/:id', authMiddleware, isAdmin, deleteVenta);
router.get('/reportes', authMiddleware, isAdmin, getReportes);

export default router;