import express from "express";
import HistorialPago from "../models/HistorialPago.js";

const router = express.Router();

// Middleware para logging
router.use((req, res, next) => {
  console.log(`🗄️ ${req.method} /historial${req.path} - Params:`, req.params, "Query:", req.query);
  next();
});

// Obtener historial de un empleado específico
router.get("/empleado/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { limite = 10, pagina = 1 } = req.query;
    
    // Buscar por empleadoId numérico o por _id
    const query = {
      $or: [
        { empleadoId: id },
        { empleadoId: Number(id) },
        { empleadoNumId: Number(id) }
      ]
    };
    
    const historial = await HistorialPago.find(query)
      .sort({ fechaRegistro: -1 })
      .limit(Number(limite))
      .skip((Number(pagina) - 1) * Number(limite));
    
    const total = await HistorialPago.countDocuments(query);
    
    res.json({
      historial,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / Number(limite))
    });
  } catch (error) {
    console.error("❌ Error al obtener historial de empleado:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener historial por mes
router.get("/mes/:mes", async (req, res) => {
  try {
    const { mes } = req.params; // Formato: YYYY-MM
    const historial = await HistorialPago.find({ mes })
      .sort({ fechaRegistro: -1 });
    
    // Agrupar por tipo de movimiento
    const resumen = await HistorialPago.aggregate([
      { $match: { mes } },
      {
        $group: {
          _id: "$tipoMovimiento",
          cantidad: { $sum: 1 },
          totalPagado: { $sum: "$sueldoFinal" },
          empleados: { $addToSet: "$nombre" }
        }
      }
    ]);
    
    res.json({
      historial,
      resumen,
      mes
    });
  } catch (error) {
    console.error("❌ Error al obtener historial por mes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener historial completo con filtros
router.get("/", async (req, res) => {
  try {
    const { 
      tipo, 
      desde, 
      hasta, 
      empleado, 
      limite = 20, 
      pagina = 1 
    } = req.query;
    
    const filtros = {};
    
    if (tipo) filtros.tipoMovimiento = tipo;
    if (empleado) filtros.nombre = new RegExp(empleado, 'i');
    if (desde || hasta) {
      filtros.fechaRegistro = {};
      if (desde) filtros.fechaRegistro.$gte = new Date(desde);
      if (hasta) filtros.fechaRegistro.$lte = new Date(hasta);
    }
    
    const historial = await HistorialPago.find(filtros)
      .sort({ fechaRegistro: -1 })
      .limit(Number(limite))
      .skip((Number(pagina) - 1) * Number(limite));
    
    const total = await HistorialPago.countDocuments(filtros);
    
    res.json({
      historial,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / Number(limite)),
      filtros
    });
  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener estadísticas del historial
router.get("/estadisticas", async (req, res) => {
  try {
    const estadisticas = await HistorialPago.aggregate([
      {
        $group: {
          _id: null,
          totalRegistros: { $sum: 1 },
          totalPagado: { $sum: "$sueldoFinal" },
          promedioSueldo: { $avg: "$sueldoFinal" },
          ultimaActualizacion: { $max: "$fechaRegistro" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRegistros: 1,
          totalPagado: { $round: ["$totalPagado", 2] },
          promedioSueldo: { $round: ["$promedioSueldo", 2] },
          ultimaActualizacion: 1
        }
      }
    ]);
    
    const porTipo = await HistorialPago.aggregate([
      {
        $group: {
          _id: "$tipoMovimiento",
          cantidad: { $sum: 1 },
          total: { $sum: "$sueldoFinal" }
        }
      },
      { $sort: { cantidad: -1 } }
    ]);
    
    res.json({
      general: estadisticas[0] || {},
      porTipo
    });
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
