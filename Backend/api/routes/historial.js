// routes/historial.js
const express = require("express");
const router = express.Router();
const Empleado = require("./models/Empleado");
const HistorialPago = require("../models/HistorialPago");

// Actualizar sueldo y registrar historial
router.put("/empleados/:id/actualizar-sueldo", async (req, res) => {
  try {
    const { id } = req.params;
    const { aumento = 0, bono = 0, horasExtra = 0, adelanto = 0 } = req.body;

    // Buscar empleado por "id" numérico
    const empleado = await Empleado.findById(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Calcular sueldo final
    const sueldoFinal =
      (empleado.sueldoBase || empleado.sueldoFinal || 0) +
      aumento +
      bono +
      horasExtra -
      adelanto;

    // 🔹 1. Actualizar empleado
    empleado.aumento = aumento;
    empleado.bono = bono;
    empleado.horasExtra = horasExtra;
    empleado.adelanto = adelanto;
    empleado.sueldoFinal = sueldoFinal;
    await empleado.save();

    // 🔹 2. Registrar en historial
    const historial = new HistorialPago({
      empleadoId: empleado._id,
      nombre: empleado.nombre,
      cargo: empleado.cargo,
      departamento: empleado.departamento,
      sueldoBase: empleado.sueldoBase,
      aumento,
      bono,
      horasExtra,
      adelanto,
      sueldoFinal,
    });

    await historial.save();

    res.json({
      message: "✅ Sueldo actualizado y guardado en historial",
      empleado,
      historial,
    });
  } catch (error) {
    console.error("❌ Error en actualizar sueldo:", error);
    res.status(500).json({ message: "Error al actualizar sueldo", error });
  }
});

module.exports = router;
