import { useState, useEffect } from 'react';

export default function App() {
  const API_MEMBRESIA = 'http://localhost:3000/api/membresia';

  const [membresias, setMembresias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  

  const estadoInicial = { carnet: '', monto: '', anio: '', mes: '', fechapago: '' };
  const [form, setForm] = useState(estadoInicial);

  const cargarDatos = async () => {
    try {
      const resMembresia = await fetch(API_MEMBRESIA);
      if (!resMembresia.ok) throw new Error('Error al cargar los datos');
      const data = await resMembresia.json();
      setMembresias(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setForm(estadoInicial);
  };

  const guardarMembresia = async (e) => {
    e.preventDefault();
    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `${API_MEMBRESIA}/${editandoId}` : API_MEMBRESIA;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Error al guardar la membresía');

      limpiarFormulario();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const prepararEdicion = (membresia) => {
    setEditandoId(membresia.id);
    setForm({
      carnet: membresia.carnet,
      monto: membresia.monto,
      anio: membresia.anio,
      mes: membresia.mes,
    
      fechapago: membresia.fechapago ? membresia.fechapago.split('T')[0] : ''
    });
  };

  const eliminarMembresia = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
      const res = await fetch(`${API_MEMBRESIA}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Sistema de Membresía</h1>

      <form onSubmit={guardarMembresia} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <input name="carnet" value={form.carnet} onChange={handleChange} placeholder="Carnet" required />
        <input name="monto" type="number" step="0.01" value={form.monto} onChange={handleChange} placeholder="Monto" required />
        <input name="anio" type="number" value={form.anio} onChange={handleChange} placeholder="Año" required />
        <input name="mes" value={form.mes} onChange={handleChange} placeholder="Mes" required />
        <input name="fechapago" type="date" value={form.fechapago} onChange={handleChange} required />
        
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar Membresía'}</button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Carnet</th>
            <th>Monto</th>
            <th>Año</th>
            <th>Mes</th>
            <th>Fecha de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {membresias.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No hay membresías registradas.</td>
            </tr>
          ) : (
            membresias.map(membresia => (
              <tr key={membresia.id}>
                <td>{membresia.carnet}</td>
                <td>{membresia.monto}</td>
                <td>{membresia.anio}</td>
                <td>{membresia.mes}</td>
                <td>{membresia.fechapago ? membresia.fechapago.split('T')[0] : ''}</td>
                <td>
                  <button onClick={() => prepararEdicion(membresia)}>Editar</button>{' '}
                  <button onClick={() => eliminarMembresia(membresia.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}