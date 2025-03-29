const { execSync } = require('child_process');

const killPort = async (port) => {
  try {
    if (process.platform === 'win32') {
      const result = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = result.split('\n')
        .filter(line => line.includes('LISTENING'))
        .map(line => line.trim());

      for (const line of lines) {
        const pid = line.match(/(\d+)\s*$/)?.[1];
        if (pid) {
          try {
            execSync(`taskkill /F /PID ${pid}`);
            console.log(`Proceso en puerto ${port} terminado (PID: ${pid})`);
          } catch (err) {
            console.log(`No se pudo terminar el proceso ${pid}`);
          }
        }
      }
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9`);
    }
    // Esperamos a que el puerto se libere
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.log(`No se encontraron procesos en el puerto ${port}`);
  }
};

module.exports = {
  killPort
};