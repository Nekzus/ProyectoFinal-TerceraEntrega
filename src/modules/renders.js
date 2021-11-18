
//**IMPORTACION SELECTORES */
import { montoTotal, contenedorProductos, contenedorSliders, cantidadTotal, printCarrito } from '../modules/selectors.js';
//**IMPORTACION FUNCIONES */
import { borrarItem, montoTotalProductos, indicadorCantidad, mensajeCarroVacio, carritoProductos, cambiarCantidad } from '../modules/functions.js';

//**MÓDULO RENDERIZADO DE PRODUCTOS */
export const renderizarProductos = (data) => {
    contenedorProductos.innerHTML = ''; // Se limpia cuerpo del contenedor de productos.
    data.forEach((item) => {
        if (item.plataforma === 'XBOX ONE') {
            contenedorProductos.innerHTML += `<div class="col-12 col-md-4 mb-3 mt-3 mr-3 ml-3 text-center">
        <div class="card">
            <div class="card-header bg-success h5">
            <i class="bi bi-xbox"></i> ${item.plataforma}
            </div>
            <img src="${item.portada}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4 class="card-title">${item.titulo}</h4>
                <p class="stock-disponible" id="stock-${item.id}">${item.stock} un. disponibles</p>
                <p class="card-text h4">$<span>${item.precio}</span></p>
            </div>
            <div class="card-footer">
                <button id="${item.id}" class="btn btn-secondary">
                <i class="bi bi-cart-plus-fill"></i> Agregar al carrito
                </button>
            </div>
        </div>
    </div>`;
        } else if (item.plataforma === 'PS4') {
            contenedorProductos.innerHTML += `<div class="col-12 col-md-4 mb-3 mt-3 mr-3 ml-3 text-center">
        <div class="card">
            <div class="card-header - bg-primary h5">
            <i class="bi bi-playstation"></i> ${item.plataforma}
            </div>
            <img src="${item.portada}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4 class="card-title">${item.titulo}</h4>
                <p class="stock-disponible" id="stock-${item.id}">${item.stock} un. disponibles</p>
                <p class="card-text h4">$<span>${item.precio}</span></p>
            </div>
            <div class="card-footer">
                <button id="${item.id}" class="btn btn-secondary">
                <i class="bi bi-cart-plus-fill"></i> Agregar al carrito
                </button>
            </div>
        </div>
    </div>`;
        } else {
            contenedorProductos.innerHTML += `<div class="col-12 col-md-4 mb-3 mt-3 mr-3 ml-3 text-center">
        <div class="card">
            <div class="card-header bg-secondary h5">
            <i class="bi bi-windows"></i> ${item.plataforma}
            </div>
            <img src="${item.portada}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4 class="card-title">${item.titulo}</h4>
                <p class="stock-disponible" id="stock-${item.id}">${item.stock} un. disponibles</p>
                <p class="card-text h4">$<span>${item.precio}</span></p>
            </div>
            <div class="card-footer">
                <button id="${item.id}" class="btn btn-secondary">
                <i class="bi bi-cart-plus-fill"></i> Agregar al carrito
                </button>
            </div>
        </div>
    </div>`;

        }

    })

};

//**MÓDULO RENDERIZADO IMAGENES DEL SLIDER */
export const renderizarSliders = (data) => {
    data.forEach((item) => {
        contenedorSliders.innerHTML += `<div class="carousel-item">
    <img src="${item.slider}" class="imagen-slider d-block w-100" title="${item.titulo}">
    <div class="carousel-caption d-none d-md-block">
        <div class="texto-slider"><h1 class="titulo-slider">${item.titulo}</h1>
        <p class="descripcion-slider">${item.descripcion}</p>
        </div>
        <div class="fondo-slider">
        </div>
    </div>
</div>`;
    })
};

//**MÓDULO RENDERIZADO CARRITO */
export const renderizarCarrito = () => {
    printCarrito.innerHTML = ''; // Se limpia el contenido del DOM.
    montoTotal.innerHTML = ''; // Se limpia el contenido del DOM.
    cantidadTotal.innerHTML = ''; // Se limpia el contenido del DOM.
    carritoProductos.forEach(item => {
        const precioCantidad = item.precio * item.cantidad;
        printCarrito.innerHTML += `
        <tr><th scope="row"><img src=${item.portada} width="90rem"></th>
        <td>${item.titulo}</td>
        <td>$${item.precio}</td>
        <td><div class="d-flex col-sm"><span class="cantidad-item"><button class="btn-cantidad btn-restar btn btn-secondary" id="${item.id}" type="button">-</button></span>
        <input type="text" id="item-cant-${item.id}" class="form-control form-cant p-1" value="${item.cantidad}" min="1" max="${item.stock}/>
        <span class="cantidad-item"><button class="btn-cantidad btn-sumar btn btn-secondary" id="${item.id}" type="button">+</button></span></div></td>
        <td>$${precioCantidad}</td>
        <td><button id="${item.id}" type="button" class="btn-borrar btn btn-default"><i class="bi bi-trash"></i></button></td></tr>`; // Se agrega botón para eliminar item. Se agrega el id del item para su posterior borrado.
    })
    borrarItem();
    montoTotal.innerHTML = `$${montoTotalProductos()}`; // Se muestra el monto total de los productos en el DOM.

    indicadorCantidad(); // Se muestra el indicador de cantidad de productos en el DOM.

    mensajeCarroVacio(); // Se muestra el mensaje de carro vacío.   

    cambiarCantidad(); // Se ejecuta la función para cambiar la cantidad de productos.
};
