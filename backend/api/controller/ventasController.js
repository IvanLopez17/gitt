import Venta from '../models/Venta.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getVentas = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'ASESOR') {
      where = { asesorId: req.user.id };
    }
    
    const ventas = await Venta.findAll({
      where,
      include: [{ 
        model: User, 
        as: 'asesor', 
        attributes: ['id', 'name', 'email', 'image'] 
      }],
      order: [['fecha_registro', 'DESC']]
    });
    
    res.json({ ventas });
  } catch (e) {
    console.error('Error obteniendo ventas:', e);
    res.status(500).json({ message: 'Error obteniendo ventas', error: e.message });
  }
};

export const addVenta = async (req, res) => {
  try {
    const { fecha_venta, codigo_reserva, cliente, total_venta } = req.body;
    
    // Validaciones
    if (!fecha_venta || !codigo_reserva || !cliente || !total_venta) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    if (parseFloat(total_venta) <= 0) {
      return res.status(400).json({ message: 'El total de la venta debe ser mayor a 0' });
    }
    
    const comision = parseFloat(total_venta) * 0.3;
    
    const venta = await Venta.create({
      fecha_venta,
      codigo_reserva,
      cliente,
      total_venta: parseFloat(total_venta),
      comision,
      asesorId: req.user.id
    });
    
    // Incluir información del asesor en la respuesta
    const ventaCompleta = await Venta.findByPk(venta.id, {
      include: [{ 
        model: User, 
        as: 'asesor', 
        attributes: ['id', 'name', 'email', 'image'] 
      }]
    });
    
    res.status(201).json({ message: 'Venta registrada', venta: ventaCompleta });
  } catch (e) {
    console.error('Error al registrar venta:', e);
    res.status(400).json({ message: 'Error al registrar venta', error: e.message });
  }
};

export const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    // Recalcular comisión si se actualiza el total
    if (req.body.total_venta) {
      req.body.comision = parseFloat(req.body.total_venta) * 0.3;
    }
    
    await venta.update(req.body);
    
    const ventaActualizada = await Venta.findByPk(id, {
      include: [{ 
        model: User, 
        as: 'asesor', 
        attributes: ['id', 'name', 'email', 'image'] 
      }]
    });
    
    res.json({ message: 'Venta actualizada', venta: ventaActualizada });
  } catch (e) {
    console.error('Error al actualizar venta:', e);
    res.status(400).json({ message: 'Error al actualizar', error: e.message });
  }
};

export const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    await venta.destroy();
    res.json({ message: 'Venta eliminada' });
  } catch (e) {
    console.error('Error al eliminar venta:', e);
    res.status(400).json({ message: 'Error al eliminar', error: e.message });
  }
};

export const getReportes = async (req, res) => {
  try {
    const { asesorId, fecha } = req.query;
    let where = {};
    
    if (asesorId) where.asesorId = asesorId;
    if (fecha) where.fecha_venta = fecha;
    
    const ventas = await Venta.findAll({ 
      where,
      include: [{ 
        model: User, 
        as: 'asesor', 
        attributes: ['id', 'name', 'email', 'image'] 
      }],
      order: [['fecha_registro', 'DESC']]
    });
    
    res.json({ ventas });
  } catch (e) {
    console.error('Error generando reporte:', e);
    res.status(500).json({ message: 'Error generando reporte', error: e.message });
  }
};