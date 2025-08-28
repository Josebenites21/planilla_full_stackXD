import mongoose from "mongoose";

const PlanillaSchema = new mongoose.Schema({
  empleadoId: { type: String, required: true },
  nombre: { type: String, required: true },
  cargo: { type: String, required: true },
  departamento: { type: String, required: true },
  sueldoBase: { type: Number, required: true },
  adelantos: { type: Number, default: 0 },
  bonos: { type: Number, default: 0 },
  horasExtras: { type: Number, default: 0 },
  sueldoFinal: { type: Number, required: true },
  mes: { type: String, default: new Date().toISOString().slice(0,7) } // "2025-08"
});

const planilla = mongoose.model("planilla", PlanillaSchema);

export default planilla;






