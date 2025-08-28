import { Router } from "express";
import Planilla from "../models/planilla.model.js";

const router = Router();

// POST /planillas
router.post("/", async (req, res) => {
  try {
    console.log("Datos recibidos en backend:", req.body); 
    const nuevaPlanilla = new Planilla(req.body);
    await nuevaPlanilla.save();
    res.status(201).json(nuevaPlanilla);
  } catch (error) {
    console.error("Error al guardar planilla:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

