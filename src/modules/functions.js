//**IMPORTACION RENDERS */
import { renderizarProductos, renderizarSliders, renderizarCarrito } from '../modules/renders.js';
//**IMPORTACION SELECTORES */
import { btnVaciarCarrito, cantidadTotal, nombreUsuario } from '../modules/selectors.js';
import { db, guardarObjetosDB, guardarDatosDB, actualizarDatosDB, auth } from '../modules/crud-firestore.js';

export let carritoProductos = JSON.parse(localStorage.getItem('carritoProductos')) || []; // Array que almacena los items ingresados por el usuario a modo de objetos. Se realiza lectura del array almacenado en localStorage.
// export const URL_DB = 'https://db-nekzusgamestore-js23175-default-rtdb.firebaseio.com/Game-Store.json' // Productos desde base de datos en firebase.
// export const URL_JSON = 'src/db/db.json' // Productos desde archivo JSON. 

//**LEER DATOS DB CLOUD FIREBASE*/
export const leerDatosDB = async (coleccion) => {
    await db.collection(coleccion).onSnapshot((onSnapshot) => { // Se lee la coleccion de la base de datos.
        const data = onSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        habilitarSolapas();
        renderizarProductos(data);
        renderizarSliders(data);
        renderizarCarrito();
        detectarBotones(data);
        vaciarCarrito();

    })
};

//**FUNCIÓN BORRADO INDIVIDUAL DE ITEM */
export const borrarItem = () => {
    const btnBorrarItem = document.querySelectorAll('.btn-borrar'); // Se seleccionan todos los botones de borrado sobre la el carrito.
    btnBorrarItem.forEach(btn => {   // Se recorren y se escucha si alguno fue pulsado
        btn.addEventListener('click', (e) => {  // Se escucha el evento click sobre el boton.
            e.stopPropagation(); // Se detiene la propagacion del evento.
            let itemBorrar = parseInt(btn.id); // Se reconoce el boton pulsado por su numero de id. Coincidente con el código de producto.
            carritoProductos = JSON.parse(localStorage.getItem('carritoProductos')); // Se lee el array almacenado en el localStorage.
            const indexItemBorrar = carritoProductos.findIndex(item => item.id === itemBorrar);
            carritoProductos.splice(indexItemBorrar, 1); // Se ejecuta el borrado.           
            localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena el array con el item borrado. 
            renderizarCarrito(); // Se recarga la pagina.   
        })
    })
};

//**FUNCIÓN MONTO TOTAL PRODUCTOS EN CARRITO */
export const montoTotalProductos = () => {
    let total = 0;
    if (carritoProductos.length != 0) {
        carritoProductos.forEach(item => {
            total += item.precio * item.cantidad; //  Se suman los montos en cada iteracion en el carrito.
        })
    };
    return total;
};

//**FUNCIÓN INDICA EN UN BADGE LA CANTIDAD TOTAL DE PRODUCTOS EN EL CARRITO */
export const indicadorCantidad = () => {
    if (carritoProductos.length != 0) {
        cantidadTotal.innerHTML = `<span class="badge rounded-pill">${carritoProductos.length}</span>`;
    } else {
        cantidadTotal.innerHTML = '';
    }
};

//**FUNCIÓN MOSTRAR ALERTA CUANDO EL CARRO ESTA VACIO */
export const mensajeCarroVacio = () => {
    if (carritoProductos.length === 0) { // Se muestra un alerta si el carrito esta vacio.
        $('#carro-vacio').fadeIn(300);
        $('#encabezado-carrito').hide();
        $('.monto-total').hide();
        $('.btn-carrito').hide();
    } else {
        $('#carro-vacio').hide(); // Se oculta el alerta si el carrito no esta vacio.
        $('#encabezado-carrito').show();
        $('.monto-total').show();
        $('.btn-carrito').show();
    }

};

//**FUNCION QUE DETECTA SI FUE PULSADO ALGUN BOTON DE AGREGAR PRODUCTO */
export const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const producto = data.find(item => item.id === parseInt(btn.id));
            if (producto.stock === 1) {
                btn.disabled = true;
                btn.innerHTML = 'Sin Stock';
            };

            if (carritoProductos.length === 0 || producto.cantidad === undefined) { // Se agrega el producto al carrito.

                producto.cantidad = 1;
            }
            ingresoCarrito(producto); // Se ingresa el producto al carrito.

        })
    })
};

//**FUNCIÓN DE INGRESO PRODUCTO SELECCIONADO AL CARRITO */
export const ingresoCarrito = (item) => {
    let productos;
    const existeItemEnCarrito = carritoProductos.some(producto => producto.id === item.id); // Revisar si el item ya fue agregado al carrito.
    if (existeItemEnCarrito) {
        productos = carritoProductos.map(producto => { // Se recorre el array de productos para actualizar la cantidad.
            if (producto.id === item.id) {
                producto.cantidad++;
                return producto; // Devuelve el item duplicado
            } else {
                return producto; // Devuelve le item sin duplicación.
            }
        });
        carritoProductos = [...productos]; // Se actualiza el array de productos.
    } else {

        item.cantidad = 1;
        carritoProductos = [...carritoProductos, item]; // Se agrega el item al array de carrito.
    }

    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena en el localStorage el nuevo objeto-item creado.
    renderizarCarrito(); // Se refresca el navegador para que se muestren los cambios.
};

//**FUNCION PARA ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO */
export const vaciarCarrito = () => {
    btnVaciarCarrito.addEventListener("click", () => {
        if (carritoProductos.length != 0) {
            carritoProductos = []; // Se eliminan todos los items del carrito.
            localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena en el localStorage el nuevo objeto-item creado.
            renderizarCarrito(); // Se recarga la pagina.
            return;
        }
    })
};

//** FUNCION PARA INCREMENTAR O DECREMENTAR LA CANTIDAD DE ITEMS MEDIANTE BOTONES */
export const cambiarCantidad = () => {
    const btnCantidad = document.querySelectorAll('.btn-cantidad');
    btnCantidad.forEach(btn => {   // Se recorren y se escucha si alguno fue pulsado
        btn.addEventListener('click', (e) => {  // Se escucha el evento click sobre el boton.
            e.stopPropagation(); // Se detiene la propagacion del evento.
            let itemCambiar = parseInt(btn.id); // Se reconoce el boton pulsado por su numero de id. Coincidente con el código de producto.
            if (e.target.classList.contains('btn-sumar')) { // Se verifica si el boton fue pulsado para incrementar o decrementar.
                carritoProductos = JSON.parse(localStorage.getItem('carritoProductos')); // Se lee el array almacenado en el localStorage.
                const producto = carritoProductos.find(item => item.id === itemCambiar);
                if (producto.cantidad < producto.stock) {
                    producto.cantidad++; // Se incrementa la cantidad del producto.
                    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena el array con el item borrado.
                    renderizarCarrito();// Se verifica si el boton fue pulsado para incrementar o decrementar.
                } else { btn.disabled = true };

            } else if (e.target.classList.contains('btn-restar')) {
                const producto = carritoProductos.find(item => item.id === itemCambiar);
                if (producto.cantidad > 1) {
                    producto.cantidad--; // Se incrementa la cantidad del producto.
                    localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena el array con el item borrado.
                    renderizarCarrito();// Se verifica si el boton fue pulsado para incrementar o decrementar.
                } else { btn.disabled = true }
            }
        }
        )
    })
};

const visibleLogout = document.querySelectorAll(".visible-logout");
const visibleLogin = document.querySelectorAll(".visible-login");

const mostrarIconos = (user) => {
    if (user) {
        visibleLogin.forEach((icono) => (icono.style.display = "block"));
        visibleLogout.forEach((icono) => (icono.style.display = "none"));
    } else {
        visibleLogin.forEach((icono) => (icono.style.display = "none"));
        visibleLogout.forEach((icono => (icono.style.display = "block")));
    }
};

//**FUNCION DE HABILITACION SOLAPAS PANTALLA INICIO */
export const habilitarSolapas = () => {
    $('#pills-signin-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $('#pills-signup-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $('#pills-logout-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $('#pills-productos-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    $('#pills-login-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    $('#pills-historial-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $('#pills-carrito-tab').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
};

$('#btnComprar').on('click', (e) => {
    e.preventDefault();
    guardarDatosDB(carritoProductos, 'transaccion');
    carritoProductos.forEach(item => {
        const id = (item.id).toString();
        const stock = (item.stock - item.cantidad);
        actualizarDatosDB('games', id, stock);
        carritoProductos = [];
        localStorage.setItem('carritoProductos', JSON.stringify(carritoProductos)); // Se almacena en el localStorage el nuevo objeto-item creado.
        renderizarCarrito();// Se verifica si el boton fue pulsado para incrementar o decrementar.

    })

});

// AUTENTICACION DE USUARIOS FIREBASE: REGISTRO DE NUEVO USUARIO
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.querySelector('#signup-name').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    const usuario = new Object(); // Se crea un objeto para almacenar los datos del usuario.
    usuario.nombre = nombre;
    usuario.email = email;
    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            guardarObjetosDB(usuario, 'usuarios');
            // Se limpia el formulario.
            signupForm.reset();
            $('#signup-modal').modal('hide')
            console.log('sign up')
        })
});

// AUTENTICACION DE USUARIOS FIREBASE: LOGIN DE USUARIO
const signinForm = document.querySelector('#login-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Se limpia el formulario.
            signinForm.reset();
            $('#signin-modal').modal('hide')
            console.log('sign in')
        })

});
// AUTENTICACION DE USUARIOS FIREBASE: LOGOUT DE USUARIO
const logout = document.querySelector('#pills-logout-tab');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('sign out')
    });

});

// EVENTOS
// LISTA DE EVENTOS USUARIO REGISTRADO
auth.onAuthStateChanged(user => {

    if (user) {
        mostrarIconos(user);
        buscarUsuario(user.email, 'usuarios');

    } else {
        nombreUsuario.innerHTML = '';
        mostrarIconos(user);
    }

});

//**OBTENER NOMBRE DE USUARIO REGISTRADO */
const buscarUsuario = async (email, coleccion) => {
    await db.collection(coleccion).onSnapshot((onSnapshot) => {
        const data = onSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        const usuarioDB = data.find(usuario => usuario.email === email);
        nombreUsuario.innerHTML = ` ${usuarioDB.nombre}`;
        const usuario = usuarioDB.nombre
        const correo = usuarioDB.email
        const datosUsuario = crearObjetoDatos(usuario, correo);
        // carritoProductos.push(datosUsuario);
        return usuarioDB;
    })
};

//**FUNCION PARA CREAR OBJETO CON DATOS DE USUARIO */
const crearObjetoDatos = (nombre, email) => {
    class Carrito {
        constructor(nombre, email) {  // Se crea un objeto para almacenar los datos del usuario.
            this.nombre = nombre;
            this.email = email;
        }
    }
    const datosObjeto = new Carrito(nombre, email);
    return datosObjeto;
}