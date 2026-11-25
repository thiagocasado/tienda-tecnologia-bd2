require("dotenv").config();
const {MongoClient} = require("mongodb");

async function ejecutarConsultas() {
    const clienteMongo = new MongoClient(process.env.MONGODB_URI);
    try{
        await clienteMongo.connect();
        const base = clienteMongo.db("tienda_tecnologia");
        // 1) Cuánto gastó cada cliente en total
        const totalPorCliente = await base.collection("ventas").aggregate([
            {$unwind: "$articulos"},
            {
                $group:{
                    _id: "$clienteId",
                    totalGastado:{
                        $sum: {
                            $multiply: ["$articulos.cantidad", "$articulos.precioUnitario"],
                        },
                    },
                },
            },
        {
            $lookup:{
                from: "clientes",
                localField: "_id",
                foreignField: "_id",
                as: "cliente",
            },
        },
        {$unwind: "$cliente"},
        {
            $project:{
                _id: 0,
                nombre: "$cliente.nombre",
                totalGastado:1,
            }
        },
        {$sort: {totalGastado: -1}},
        ]).toArray();
        console.log("=== Total gastado por cliente ===");
        console.dir(totalPorCliente, {depth: null});

        // 2) Cuántas unidades se vendieron de cada producto
        const unidadesPorProducto = await base.collection("ventas").aggregate([
            {$unwind: "$articulos"},
            {
                $group:{
                    _id: "$articulos.productoId",
                    unidadesVendidas: {$sum: "$articulos.cantidad"},
                },
            },
            {$sort: {unidadesVendidas: -1}},
            {
                $lookup:{
                from:"productos",
                localField:"_id",
                foreignField: "_id",
                as:"producto",
                },

            },
            {$unwind: "$producto"},
            {
                $project:{
                    _id: 0,
                    nombre: "$producto.nombre",
                    unidadesVendidas: 1,
                },
            },


        ]).toArray();
        console.log("=== Productos mas vendidos ===");
        console.dir(unidadesPorProducto, {depth: null});
        
        // 3) Cuánta plata se vendió en cada categoría
        const totalPorCategoria = await base.collection("ventas").aggregate([

            {$unwind: "$articulos"},
            {
                $lookup:{
                    from: "productos",
                    localField: "articulos.productoId",
                    foreignField: "_id",
                    as: "producto",
                },
            },
            {$unwind: "$producto"},
            {
                $group:{
                    _id: "$producto.categoria",
                    totalVendido:{
                        $sum:{
                            $multiply:["$articulos.cantidad", "$articulos.precioUnitario"],
                        },
                    },
                },
            },
            {$project:{
                _id:0,
                categoria:"$_id",
                totalVendido:1,
            }},
            {$sort: {totalVendido: -1}},
        ]).toArray();
        console.log("=== Total vendido por categoria ===");
        console.dir(totalPorCategoria, {depth: null});
        
        
        

    } finally{
        await clienteMongo.close();
    }
}
ejecutarConsultas().catch(error =>{
    console.error("No se pudieron ejecutar las consultas:", error.message);
    
}) 