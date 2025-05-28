const express= require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();  
app.use(cors());
app.use(express.json());
const pool = new Pool({
    user: 'MATEOT\Mateo',
    host: 'localhost',
    database: 'Cotizacion',
    password: '1234',   
    port: 5432,
    })
    
app.post('/api/cotizaciones', async (req, res) => {
  const { nombre, ciudad, direccion, celular, mensaje, productos } = req.body;
  try {
    // Guarda la cotización principal
    const result = await pool.query(
      'INSERT INTO cotizaciones (nombre, ciudad, direccion, celular, mensaje) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre, ciudad, direccion, celular, mensaje]
    );
    const cotizacionId = result.rows[0].id;

    // Guarda los productos asociados
    for (const producto of productos) {
      await pool.query(
        'INSERT INTO cotizacion_productos (cotizacion_id, nombre, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [cotizacionId, producto.nombre, producto.cantidad, producto.precioActual]
      );
    }

    res.json({ success: true, cotizacionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al guardar la cotización' });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend escuchando en http://localhost:3001');
});