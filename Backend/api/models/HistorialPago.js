// models/HistorialPago.js - SOLO CAMPOS NECESARIOS
import mongoose from "mongoose";

const HistorialPagoSchema = new mongoose.Schema({
  // Información del empleado
  empleadoNumId: { type: Number, required: true },
  nombre: { type: String, required: true },
  cargo: { type: String, required: true },
  departamento: { type: String, required: true },
  
  // Detalles del pago/ajuste
  sueldoBase: { type: Number, required: true },
  aumento: { type: Number, default: 0 },
  bono: { type: Number, default: 0 },
  horasExtra: { type: Number, default: 0 },
  adelanto: { type: Number, default: 0 },
  sueldoFinal: { type: Number, default: 0 },
  // Control temporal
  mes: { type: String, default: () => new Date().toISOString().slice(0, 7) } // YYYY-MM
}, { 
  collection: "historial_pagos", 
  timestamps: false // Sin timestamps automáticos
});

// Índices para consultas rápidas
HistorialPagoSchema.index({ empleadoNumId: 1, mes: -1 });

export default mongoose.model('HistorialPago', HistorialPagoSchema);
