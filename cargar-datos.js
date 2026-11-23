require("dotenv").config();
const {mongoClient, MongoClient} = require("mongodb");

async function cargarDatos() {
  const clienteMongo = new MongoClient(process.env.MONGODB_URI);

  try {
    await clienteMongo.connect();
    const base = clienteMongo.db("tienda_tecnologia");

    await base.collection("clientes").insertMany(clientes);
    await base.collection("productos").insertMany(productos);
    await base.collection("ventas").insertMany(ventas);

    console.log("Datos de ejemplo cargados");
  } finally {
    await clienteMongo.close();
  }
} 

cargarDatos().catch(error => {
  console.error("No se pudieron cargar los datos:", error.message);
});
const clientes = [
    {
        _id: "cliente-001",
        nombre: "Ana Perez",
        email: "ana@example.com",
        ciudad: "Avellaneda"
    }
]
const productos = [
  {
    _id: 'producto-001',
    nombre: 'Teclado mecanico',
    categoria: 'Perifericos',
    precio: 25000,
  },
];
const ventas = [
  {
    _id: 'venta-001',
    clienteId: 'cliente-001',
    fecha: new Date('2026-11-22T15:00:00-03:00'),
    articulos: [
      {
        productoId: 'producto-001',
        cantidad: 2,
        precioUnitario: 20000,
      },
    ],
  },
];
