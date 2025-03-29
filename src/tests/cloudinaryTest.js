const { cloudinary } = require('../config/cldry');

//? Función para probar la conexión para Cloudinary
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Conexión a Cloudinary exitosa:", result);
  }
  catch (error) {
    console.error("Error de conexión:", error);
  }
};

//? Función para probar la subida de archivos
const testUpload = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      "../upload/aboutMe.jpeg",
      {
        folder: "test",
        resource_type: "auto"
      }
    );
    console.log("Subida exitosa:", result);
    return result.public_id;
  }
  catch (error) {
    console.error("Error al subir:", error);
    return null;
  }
};

//? Función para probar el borrado de archivos
const testDestroy = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Imagen borrada exitosamente:", result);
  }
  catch (error) {
    console.error("Error al borrar la imagen:", error);
  }
};

//? Ejecutar todas las pruebas secuencialmente
const runAllTests = async () => {
  console.log('Iniciando pruebas de Cloudinary...\n');

  // Test de conexión
  console.log('1. Probando conexión...');
  await testConnection();

  // Test de subida
  console.log('\n2. Probando subida de archivo...');
  const publicId = await testUpload();

  if (publicId) {
    // Test de borrado
    console.log('\n3. Probando borrado de archivo...');
    await testDestroy(publicId);
  }

  console.log('\nPruebas completadas');
};

runAllTests();