//**CONFIGURACION ACCESO BASE DE DATOS CLOUD FIRESTORE */
firebase.initializeApp({
    apiKey: "AIzaSyAj_QzB-MmlcW9SO491oYjXz5pveZCWLJY",
    authDomain: "db-nekzusgamestore-js23175.firebaseapp.com",
    projectId: "db-nekzusgamestore-js23175"
});

export const db = firebase.firestore();
export const auth = firebase.auth();

//**AGREGAR DATO A LA BASE DE DATOS */
export const guardarDatosDB = (datos, coleccion) => {

    db.collection(coleccion).add({
        datos
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        })
};

//**AGREGAR UN OBJETO A LA BASE DE DATOS */
export const guardarObjetosDB = (datos, coleccion) => {
    db.collection(coleccion).add(datos)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(err => {
            console.log("Error adding document: ", err);
        })
};

//**LEER DATOS EN LA BASE DE DATOS */
export const leerDatosDB = async (coleccion) => {
    await db.collection(coleccion).onSnapshot((onSnapshot) => {
        const data = onSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        return data;
    })
};

//**BORRAR DATOS EN LA BASE DE DATOS */
export const borrarDatosDB = (id, coleccion) => {
    db.collection(coleccion).doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
};

//**ACTUALIZAR DATOS EN LA BASE DE DATOS */
export const actualizarDatosDB = (coleccion, id, dato) => {
    const actualizarRef = db.collection(coleccion).doc(id);

    return actualizarRef.update({
        stock: dato,
    })
        .then(function () {
            console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
};