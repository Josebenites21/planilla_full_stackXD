// models/Empleado.js - SOLO CAMPOS BÁSICOS
import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true, required: true },
    nombre: { type: String, required: true, trim: true },
    cargo: String,
    departamento: String,

    sueldo: { type: Number, default: 0 },   // sueldo actual del empleado

    numero: { type: Number },
    direccion: { type: String },
    ingreso_laboral: Date,
  },
  { collection: "empleados", versionKey: false, timestamps: true }
);

export default mongoose.model("Empleado", empleadoSchema);
