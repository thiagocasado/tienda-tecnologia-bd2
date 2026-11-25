# Tienda de tecnologia

Trabajo practico de Bases de Datos 2, division 133, UTN Avellaneda

## Que hace el programa

El programa se conecta a MongoDB y consulta las ventas de una tienda de tecnologia. Para probarlo cargamos 30 clientes, 30 productos y 30 ventas de ejemplo.

## Como ejecutarlo

Hace falta tener Node.js instalado y MongoDB local en funcionamiento. Abri PowerShell en la carpeta del proyecto.

1. Instala las dependencias

   ```powershell
   npm ci
   ```

2. Si todavia no tenes un archivo `.env`, copialo del ejemplo

   ```powershell
   Copy-Item .env.example .env
   ```

   El archivo de ejemplo trae la direccion para conectarse al MongoDB de tu computadora.

3. Carga los datos de ejemplo

   ```powershell
   node .\cargar-datos.js
   ```

   El script borra los datos anteriores y los vuelve a cargar, asi que se puede correr las veces que haga falta.

4. Ejecuta las consultas

   ```powershell
   node .\consultar-datos.js
   ```

## Como organizamos los datos

- `clientes` guarda el ID, nombre, correo y ciudad de cada cliente
- `productos` guarda el ID, nombre, categoria y precio actual de cada producto
- `ventas` guarda el ID de la venta, el ID del cliente, la fecha y la lista de articulos. Cada articulo tiene el ID del producto, la cantidad y el precio por unidad

En la venta guardamos el `clienteId` para poder buscar al cliente en su coleccion. Hacemos algo parecido con `productoId` para buscar el nombre y la categoria del producto.

Pusimos los articulos dentro de la venta porque todos son parte de esa compra. Tambien guardamos el precio que se pago. Por ejemplo, Ana compro dos teclados a $20.000 cada uno. En el catalogo el teclado figura a $25.000, pero la compra de Ana sigue sumando $40.000.

## Consultas

- **Total gastado por cliente**. Suma lo que gasto cada cliente entre todas sus compras
- **Productos mas vendidos**. Suma las unidades vendidas de cada producto
- **Ventas por categoria**. Suma el importe vendido en cada categoria