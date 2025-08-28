// Script para limpiar la base de datos de empleados
// Remover campos legacy y dejar solo campos básicos

import mongoose from "mongoose";
import Empleado from "./api/models/empleado.js";

// Conectar a MongoDB
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/planilla";

async function limpiarEmpleados() {
  try {
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB conectado");

    console.log("🧹 Limpiando campos legacy de empleados...");
    
    // Actualizar todos los empleados para remover campos legacy
    const resultado = await Empleado.updateMany(
      {}, // Actualizar todos los documentos
      {
        $unset: {
          // Remover campos legacy
          adelanto: "",
          aumento: "",
          bono: "",
          horasExtra: "",
          sueldoBase: "",
          sueldoFinal: ""
        }
      }
    );

    console.log(`✅ Empleados actualizados: ${resultado.modifiedCount}`);
    
    // Verificar que se limpiaron
    const empleados = await Empleado.find().lean();
    console.log("\n📋 Empleados después de la limpieza:");
    
    empleados.forEach((emp, index) => {
      console.log(`\n💰 Empleado ${index + 1}:`);
      console.log(`   ID: ${emp.id}`);
      console.log(`   Nombre: ${emp.nombre}`);
      console.log(`   Sueldo: ${emp.sueldo}`);
      console.log(`   Campos legacy removidos: ✅`);
    });

    console.log("\n🎯 Limpieza completada exitosamente!");
    
  } catch (error) {
    console.error("❌ Error durante la limpieza:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

// Ejecutar el script
limpiarEmpleados();
