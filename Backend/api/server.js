import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "dotenv/config.js";
import { connectDB } from "./config/db.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import planillaRoutes from "./routes/planilla.routes.js";
import historialRoutes from "./routes/historialRoutes.js";
import HistorialPago from "./models/HistorialPago.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: "*" })); // Angular puede llamar al backend
app.use(express.json());
app.use(morgan("dev"));

// Ruta raíz con soporte para consultas por mes
app.get("/", async (req, res) => {
  const { mes } = req.query;
  
  if (mes) {
    try {
      console.log(`🔍 Consultando historial de pagos para el mes: ${mes}`);
      
      // Consultar MongoDB por mes
      const historial = await HistorialPago.find({ mes })
        .sort({ fechaRegistro: -1 });
      
      console.log(`✅ Encontrados ${historial.length} registros para ${mes}`);
      
      // Devolver JSON con los datos
      res.json(historial);
    } catch (error) {
      console.error(`❌ Error consultando historial para ${mes}:`, error);
      res.status(500).json({ 
        error: "Error consultando la base de datos",
        mes: mes,
        detalles: error.message 
      });
    }
  } else {
    // Sin parámetro mes, mostrar mensaje genérico
    res.send("API Planilla OK");
  }
});

console.log("🔧 Cargando rutas de empleados...");
app.use("/empleados", empleadoRoutes);
console.log("✅ Rutas de empleados cargadas");

console.log("🔧 Cargando rutas de planillas...");
app.use("/planillas", planillaRoutes); // ⚡ plural
console.log("✅ Rutas de planillas cargadas");

console.log("🔧 Cargando rutas de historial...");
app.use("/historial", historialRoutes); // ⚡ nuevo: historial de pagos
console.log("✅ Rutas de historial cargadas");

// Conectar DB y levantar servidor
const PORT = process.env.PORT || 3000;
await connectDB(process.env.MONGO_URI);

try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
    process.exit(1); // opcional: Swarm puede intentar reiniciar
  }
  