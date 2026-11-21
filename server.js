const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json()); 

let membresia = [
  { id: 1, carnet: '2490-23-13768', monto: 2, anio: '2023', mes: 'enero', fechapago: '2023-01-15' }
];

//RUTAS CRUD DE membresia 
app.get('/api/membresia', (req, res) => {
  res.json(membresia);
});

app.post('/api/membresia', (req, res) => {
  const nuevaMembresia = {
    id: Date.now(),
    carnet: req.body.carnet,
    monto: Number(req.body.monto),
    anio: req.body.anio,
    mes: req.body.mes,
    fechapago: req.body.fechapago,
  };
  membresia.push(nuevaMembresia);
  res.status(201).json(nuevaMembresia);
});

app.put('/api/membresia/:id', (req, res) => {
  const id = Number(req.params.id);
  membresia = membresia.map(l => (l.id === id ? { ...l, ...req.body, id } : l));
  res.json({ mensaje: 'Membresía actualizada' });
});

app.delete('/api/membresia/:id', (req, res) => {
  const id = Number(req.params.id);
  membresia = membresia.filter(l => l.id !== id);
  res.json({ mensaje: 'Membresía eliminada' });
});

app.listen(3000, () => {
  console.log('Servidor API corriendo en http://localhost:3000');
});