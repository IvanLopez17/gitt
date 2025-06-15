import Venta from '../models/Venta.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getVentas = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'ASESOR')
      where = { asesorId: req.user.id };
    const ventas = await Venta.findAll({
      where,
      include: [{ model: User, as: 'asesor', attributes: ['id', 'name', 'email', 'image'] }]
    });
    res.json({ ventas });
  } catch (e) {
    res.status(500).json({ message: 'Error obteniendo ventas', error: e.message });
  }
};

export const addVenta = async (req, res) => {
  try {
    const { fecha_venta, codigo_reserva, cliente, total_venta } = req.body;
    const comision = total_venta * 0.3;
    const venta = await Venta.create({
      fecha_venta,
      codigo_reserva,
      cliente,
      total_venta,
      comision,
      asesorId: req.user.id
    });
    res.status(201).json({ message: 'Venta registrada', venta });
  } catch (e) {
    res.status(400).json({ message: 'Error al registrar venta', error: e.message });
  }
};

export const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    await venta.update(req.body);
    res.json({ message: 'Venta actualizada', venta });
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar', error: e.message });
  }
};

export const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    await venta.destroy();
    res.json({ message: 'Venta eliminada' });
  } catch (e) {
    res.status(400).json({ message: 'Error al eliminar', error: e.message });
  }
};

export const getReportes = async (req, res) => {
  try {
    const { asesorId, fecha } = req.query;
    let where = {};
    if (asesorId) where.asesorId = asesorId;
    if (fecha) where.fecha_venta = fecha;
    const ventas = await Venta.findAll({ where });
    res.json({ ventas });
  } catch (e) {
    res.status(500).json({ message: 'Error generando reporte', error: e.message });
  }
};