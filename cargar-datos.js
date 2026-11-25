require("dotenv").config();
const { MongoClient } = require("mongodb");

async function cargarDatos() {
  const clienteMongo = new MongoClient(process.env.MONGODB_URI);

  try {
    await clienteMongo.connect();
    const base = clienteMongo.db("tienda_tecnologia");

    // Borramos lo que haya antes de cargar, así el script se puede correr varias veces
    await base.collection("clientes").deleteMany({});
    await base.collection("productos").deleteMany({});
    await base.collection("ventas").deleteMany({});

    await base.collection("clientes").insertMany(clientes);
    await base.collection("productos").insertMany(productos);
    await base.collection("ventas").insertMany(ventas);

    console.log("Datos de ejemplo cargados");
  } finally {
    await clienteMongo.close();
  }
} 


const clientes = [
  {
    _id: "cliente-001",
    nombre: "Ana Perez",
    email: "ana@example.com",
    ciudad: "Avellaneda"
  },
  {
    _id: "cliente-002",
    nombre: "Bruno Diaz",
    email: "bruno@example.com",
    ciudad: "Lanus"
  }
  
]
const ciudades = ["Avellaneda", "Lanus", "Quilmes", "Lomas de Zamora", "Banfield"];
for (let numero = 3; numero <= 30; numero++){
  const codigo = String(numero).padStart(3,"0");
  clientes.push({
    _id: `cliente-${codigo}`,
    nombre: `Cliente ${numero}`,
    email: `cliente${codigo}@example.com`,
    ciudad: ciudades[numero % ciudades.length]
  });
}

const productos = [
  {
    _id: 'producto-001',
    nombre: 'Teclado mecanico',
    categoria: 'Perifericos',
    precio: 25000,
  },
];
const modelos = [
  {nombre: "Mouse", categoria: "Perifericos", precio: 12000},
  {nombre: "Monitor", categoria: "Pantallas", precio: 150000},
  {nombre: "Disco SSD", categoria: "Almacenamiento", precio: 45000}
  
];
for(let numero = 2; numero<=30; numero++){
  const codigo = String(numero).padStart(3, "0");
  const posicion = (numero - 2) % modelos.length;
  const modelo = modelos[posicion];
  productos.push({
    _id: `producto-${codigo}`,
    nombre: `${modelo.nombre} ${numero}`,
    categoria: modelo.categoria,
    precio: modelo.precio 
  })
}

const mouse = productos[1];
const monitor = productos[2];
const ventas = [
  {
    _id: 'venta-001',
    clienteId: 'cliente-001',
    fecha: new Date(2026, 10, 22),
    articulos: [
      {
        productoId: 'producto-001',
        cantidad: 2,
        precioUnitario: 20000,
      },
    ],
  },
  {
    _id: "venta-002",
    clienteId: "cliente-001",
    fecha: new Date(2026, 10, 23),
    articulos:[{ 
      productoId: mouse._id,
      cantidad: 1,
      precioUnitario: mouse.precio
    },
    {
      productoId: monitor._id,
      cantidad: 1,
      precioUnitario: monitor.precio
    } 
  ]
}

];
for (let numero = 3; numero <= 30; numero++){
  const codigo = String(numero).padStart(3,"0");
  const cliente = clientes[numero - 2];
  const producto = productos[numero - 1];
  ventas.push({
    _id: `venta-${codigo}`,
    clienteId: cliente._id,
    // El mes va de 0 a 11 (0 es enero), así que con % 11 quedan fechas de enero a noviembre
    fecha: new Date(2026, numero % 11, 10),
    articulos: [{
      productoId: producto._id,
      // Cantidad de 1 a 3 para que las consultas no den todo igual
      cantidad: (numero % 3) + 1,
      precioUnitario: producto.precio
    }]
  });
}

cargarDatos().catch(error => {
  console.error("No se pudieron cargar los datos:", error.message);
});
