import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';
import User from './User.js';

const Venta = sequelize.define('Venta', {
  fecha_venta: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  codigo_reserva: { type: DataTypes.STRING, allowNull: false },
  cliente: { type: DataTypes.STRING, allowNull: false },
  total_venta: { type: DataTypes.FLOAT, allowNull: false },
  comision: { type: DataTypes.FLOAT, allowNull: false }
});

Venta.belongsTo(User, { as: 'asesor', foreignKey: 'asesorId' });

export default Venta;