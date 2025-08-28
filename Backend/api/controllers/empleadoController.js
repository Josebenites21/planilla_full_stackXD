import Empleado from "../models/empleado.js";
import HistorialPago from "../models/HistorialPago.js";

export async function listar(req, res) {
  const docs = await Empleado.find().sort({ id: 1 }).lean();
  console.log("📋 Empleados encontrados:", docs.length);
  if (docs.length > 0) {
    console.log("📝 Primer empleado:", JSON.stringify(docs[0], null, 2));
    // 🔍 DEBUG: Verificar que el sueldo esté actualizado
    docs.forEach((emp, index) => {
      console.log(`💰 Empleado ${index + 1} - ID: ${emp.id}, Nombre: ${emp.nombre}, Sueldo: ${emp.sueldo}`);
    });
  }
  res.json(docs);
}

export async function obtener(req, res) {
  const doc = await Empleado.findOne({ id: Number(req.params.id) }).lean();
  if (!doc) return res.status(404).json({ error: "No encontrado" });
  res.json(doc);
}

export async function crear(req, res) {
  console.log("📩 Datos que llegaron:", req.body); // <-- Ver qué manda Angular
  try {
    const ultimo = await Empleado.findOne().sort({ id: -1 }).lean();
    req.body.id = ultimo ? ultimo.id + 1 : 1;

    const doc = await Empleado.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}



export const actualizar = async (req, res) => {
  try {
    console.log("🚀 FUNCIÓN ACTUALIZAR EJECUTÁNDOSE");
    console.log("📥 Parámetros recibidos:", req.params);
    console.log("📦 Body recibido:", req.body);
    
    const { aumento, bono, horasExtra, adelanto, motivo } = req.body;
    const pagoPorHoraExtra = 10;

    console.log("🔍 Buscando empleado con ID:", req.params.id);
    
    // Buscar empleado existente
    let empleadoAnterior = await Empleado.findOne({ id: Number(req.params.id) });
    
    if (!empleadoAnterior) {
      console.log("🔄 No encontrado por 'id', intentando por '_id'");
      
      try {
        const empleadoRaw = await Empleado.collection.findOne({ _id: Number(req.params.id) });
        if (empleadoRaw) {
          empleadoAnterior = new Empleado(empleadoRaw);
          console.log("✅ Encontrado con _id numérico (raw):", Number(req.params.id));
        }
      } catch (err) {
        console.log("⚠️ Error en búsqueda raw:", err.message);
      }
    }

    if (!empleadoAnterior) {
      console.log("❌ Empleado no encontrado");
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    // 🔧 Calcular nuevo sueldo basado en el sueldo actual
    const sueldoActual = empleadoAnterior.sueldo || 0;
    const nuevoSueldo = sueldoActual + 
      (aumento || 0) + 
      (bono || 0) + 
      ((horasExtra || 0) * pagoPorHoraExtra) - 
      (adelanto || 0);

    console.log("💰 Sueldo actual:", sueldoActual, "→ Nuevo sueldo:", nuevoSueldo);

    // 🔧 ACTUALIZAR SOLO el campo sueldo en empleados
    let empleadoActualizado;
    
    console.log("🔧 Intentando actualizar empleado con ID:", empleadoAnterior.id);
    console.log("🔧 Nuevo sueldo a establecer:", nuevoSueldo);
    
    if (empleadoAnterior.id) {
      console.log("🔧 Usando findOneAndUpdate con campo 'id'");
      empleadoActualizado = await Empleado.findOneAndUpdate(
        { id: empleadoAnterior.id },
        { sueldo: nuevoSueldo }, // ✅ SOLO actualizar sueldo
        { new: true }
      );
      console.log("🔧 Resultado findOneAndUpdate:", empleadoActualizado ? "ÉXITO" : "FALLÓ");
    } else {
      console.log("🔧 Usando collection.findOneAndUpdate con _id");
      const updateResult = await Empleado.collection.findOneAndUpdate(
        { _id: Number(req.params.id) },
        { $set: { sueldo: nuevoSueldo } }, // ✅ SOLO actualizar sueldo
        { returnDocument: 'after' }
      );
      empleadoActualizado = updateResult.value ? new Empleado(updateResult.value) : null;
      console.log("🔧 Resultado collection.findOneAndUpdate:", empleadoActualizado ? "ÉXITO" : "FALLÓ");
    }

    if (!empleadoActualizado) {
      return res.status(500).json({ error: "No se pudo actualizar el empleado" });
    }

    // 🔧 LIMPIAR campos legacy después de actualizar el sueldo
    console.log("🧹 Limpiando campos legacy...");
    await Empleado.updateOne(
      { id: empleadoAnterior.id },
      { 
        $unset: {
          adelanto: "",
          aumento: "",
          bono: "",
          horasExtra: "",
          sueldoBase: "",
          sueldoFinal: ""
        }
      }
    );
    console.log("🧹 Campos legacy limpiados");

    // 🔍 DEBUG: Verificar que la actualización fue exitosa
    console.log("✅ Empleado actualizado en BD:", {
      id: empleadoActualizado.id,
      nombre: empleadoActualizado.nombre,
      sueldoAnterior: sueldoActual,
      sueldoNuevo: empleadoActualizado.sueldo
    });

    // 🔧 Crear registro en historial_pago - SOLO campos necesarios
    const historialRegistro = new HistorialPago({
      empleadoNumId: empleadoAnterior.id,
      nombre: empleadoAnterior.nombre,
      cargo: empleadoAnterior.cargo,
      departamento: empleadoAnterior.departamento,
      
      sueldoBase: sueldoActual, // Sueldo anterior
      aumento: aumento || 0,
      bono: bono || 0,
      horasExtra: horasExtra || 0,
      adelanto: adelanto || 0,
      // El campo 'mes' se genera automáticamente
    });

    await historialRegistro.save();
    console.log("📊 Historial registrado:", historialRegistro._id);

    console.log("✅ Empleado actualizado:", empleadoActualizado._id);
    
    // 🔍 DEBUG: Verificar respuesta final
    console.log("📤 Enviando respuesta al frontend");
    console.log("📊 Empleado en respuesta:", empleadoActualizado);
    console.log("📊 Historial en respuesta:", historialRegistro);
    
    res.json({
      empleado: empleadoActualizado,
      historial: historialRegistro,
      mensaje: "Empleado actualizado y registrado en historial"
    });
    
    console.log("🎯 FUNCIÓN ACTUALIZAR COMPLETADA EXITOSAMENTE");
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    console.error("❌ Stack trace:", error.stack);
    res.status(500).json({ error: "Error en el servidor" });
  }
};



export async function eliminar(req, res) {
  const doc = await Empleado.findOneAndDelete({ id: Number(req.params.id) });
  if (!doc) return res.status(404).json({ error: "No encontrado" });
  res.json({ message: "Eliminado correctamente" });
}