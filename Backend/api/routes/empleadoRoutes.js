import express from "express";
import {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
} from "../controllers/empleadoController.js";

const router = express.Router();

// Middleware para logging de todas las rutas
router.use((req, res, next) => {
  console.log(`🌐 ${req.method} /empleados${req.path} - Params:`, req.params);
  console.log(`🔍 Ruta específica: ${req.method} ${req.path}`);
  console.log(`📦 Body recibido:`, req.body);
  next();
});

router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
