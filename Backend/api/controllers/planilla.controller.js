import Planilla from "../models/planilla.model.js";

export async function listarPorMes(req, res) {
  const { mes } = req.params;
  const registros = await Planilla.find({ mes }).lean();
  res.json(registros);
}

export async function historialEmpleado(req, res) {
  const { id } = req.params;
  const registros = await Planilla.find({ empleadoId: Number(id) }).lean();
  res.json(registros);
}

export async function crearRegistro(req, res) {
  try {
    const data = req.body;

    data.sueldo_final = (data.sueldo_base || 0) + (data.bonos || 0) + (data.horas_extra || 0) - (data.adelantos || 0);

    const registro = await Planilla.create(data);
    res.status(201).json(registro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
