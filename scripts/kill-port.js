const { killPort } = require('../src/utils/portManager');

// Puertos que queremos mantener limpios
const portsToClean = [3000, 9229, 9230];

const cleanPorts = async () => {
  console.log('Iniciando limpieza de puertos...');

  for (const port of portsToClean) {
    await killPort(port);
  }

  console.log('Limpieza de puertos completada');
};

cleanPorts();
