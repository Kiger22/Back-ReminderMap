const Reminder = require('../api/models/Reminder.model');
const Place = require('../api/models/Places.model');

//* Elimina los recordatorios cuya fecha y hora ya han pasado

const cleanupPastReminders = async () => {
  try {
    console.log('Iniciando limpieza de recordatorios pasados...');

    const currentDate = new Date();

    // Buscamos recordatorios pasados
    const pastReminders = await Reminder.find({
      $or: [
        { date: { $lt: new Date(currentDate.toISOString().split('T')[0]) } },
        {
          date: new Date(currentDate.toISOString().split('T')[0]),
          time: { $lt: currentDate.toTimeString().substring(0, 5) }
        }
      ]
    });

    console.log(`Se encontraron ${pastReminders.length} recordatorios pasados para eliminar`);

    // Actualizamos los contadores de lugares para cada recordatorio eliminado.
    for (const reminder of pastReminders) {
      if (reminder.location) {
        try {
          // Buscamos el lugar por su ubicación
          const place = await Place.findOne({ location: reminder.location });
          // Actualizamos el contador
          if (place && place.useCount > 0) {
            place.useCount -= 1;
            await place.save();
          }
        } catch (error) {
          console.error(`Error al actualizar contador del lugar para recordatorio ${reminder._id}:`, error);
        }
      }

      // Eliminamos el recordatorio
      await Reminder.findByIdAndDelete(reminder._id);
    }

    console.log('Limpieza de recordatorios pasados completada');
    return pastReminders.length;
  } catch (error) {
    console.error('Error durante la limpieza de recordatorios pasados:', error);
    throw error;
  }
};

module.exports = { cleanupPastReminders };