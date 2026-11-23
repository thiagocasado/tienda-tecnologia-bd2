require("dotenv").config();
const {MongoClient} = require("mongodb");

async function consultarCliente() {
    const clienteMongo = new MongoClient(process.env.MONGODB_URI);
    try{
        await clienteMongo.connect();
        const base = clienteMongo.db("tienda_tecnologia");
        const resultado = await base.collection("ventas").aggregate([
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
        }
        ]).toArray();
        console.dir(resultado, {depth: null});
        const unidadesPorProducto = await base.collection("ventas").aggregate([
            {$unwind: "$articulos"},
            {
                $group:{
                    _id: "$articulos.productoId",
                    unidadesVendidas: {$sum: "$articulos.cantidad"},
                },
            },
            {$sort: {unidadesVendidas:- 1}},
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
        console.dir(unidadesPorProducto, {depth: null});
        
        const articulosConProducto = await base.collection("ventas").aggregate([

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
        ]).toArray();
        console.dir(articulosConProducto, {depth: null})
        
        
        

    } finally{
        await clienteMongo.close();
    }
}
consultarCliente().catch(error =>{
    console.error("no se pudo consultar el cliente: ", error.message);
    
}) 