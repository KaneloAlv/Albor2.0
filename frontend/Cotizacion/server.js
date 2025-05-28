import express from 'express';
import cors from 'cors';
import { pool } from "../../database/connectionPostgreSQL.js"

const app = express();
app.use(cors());
app.use(express.json());


const handleConfirmarPedido = async () => {
  const datosCotizacion = {
    nombre,           // string
    ciudad,           // string
    direccion,        // string
    celular,          // string
    mensaje,          // string
    productos         // array de objetos: [{ nombre, cantidad, precioActual }]
  };

  try {
    const response = await fetch('http://127.0.0.1:5501/frontend/Cotizacion/Cotizacion.htmls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCotizacion)
    });
    const data = await response.json();
    if (data.success) {
      alert('Cotización guardada con éxito');
      // Aquí puedes limpiar el formulario o cerrar el modal
    } else {
      alert('Error al guardar la cotización');
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
  }
};


app.post('/api/cotizaciones', async (req, res) => {
  const { nombre, ciudad, direccion, celular, mensaje, productos } = req.body;
  try {
    // Guarda la cotización principal
    const result = await pool.query(
      'INSERT INTO ventas (nombre, ciudad, direccion, celular, mensaje) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre, ciudad, direccion, celular, mensaje]
    );
    const cotizacionId = result.rows[0].id;

    // Guarda los productos asociados
    for (const producto of productos) {
      await pool.query(
        'INSERT INTO ventas_productos (cotizacion_id, nombre, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [cotizacionId, producto.nombre, producto.cantidad, producto.precioActual]
      );
    }

    res.json({ success: true, cotizacionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al guardar la cotización' });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});