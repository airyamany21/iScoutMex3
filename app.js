//Configuración de Firebase de App Web
let firebaseConfig = {
    apiKey: "AIzaSyCY8ZE1LzKI7FXSwDtEj43mttKNpuhpwOY",
    authDomain: "gestor-de-datos-de-futbol-mx.firebaseapp.com",
    databaseURL: "https://gestor-de-datos-de-futbol-mx.firebaseio.com",
    projectId: "gestor-de-datos-de-futbol-mx",
    storageBucket: "gestor-de-datos-de-futbol-mx.appspot.com",
    messagingSenderId: "822170602705",
    appId: "1:822170602705:web:30a2496937645f396649f0"
};
// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

//Login con Google
$('#loginG').click(function () {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // console.log(result.user);
        //  $('#root').append("<img src='"+result.user.photoURL+"'/>")
        //   $('#root').append("<img stc='"+)
        let usuario = db.collection('users').doc(result.user.uid);
        //Verifica si existe usuario
        usuario.get().then(user => {
            if (!user.exists) {
                console.log("No existe el usuario");
                guardarDatos(result.user);
            } else {
                console.log("Ya existe");
                console.log(user.data().rol);
                if (user.data().rol == "scout") {
                    console.log(user.data().rol);
                    window.location.href = 'scout.html'
                } else if (user.data().rol == "entrenador") {
                    console.log(user.data().rol);
                    window.location.href = 'https://www.fifaindex.com/es-mx/'
                } else if (user.data().rol == "periodista") {
                    console.log(user.data().rol);
                    window.location.href = 'https://www.fifaindex.com/es-mx/'
                } else if (user.data().rol == "jugador") {
                    console.log(user.data().rol);
                    window.location.href = 'https://www.fifaindex.com/es-mx/'
                }
            }
        });
        console.log('Se pudo acceder con Google');
    });
});

// Login con Facebook
$('#loginF').click(function () {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
        guardarDatos(result.user);
        console.log('Se pudo acceder');
        // window.location.href = 'scout.html'
    }).catch(err => {
        console.log(err);
    });
});

// Login con Correo
$('#ingresar').click(function () {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            console.log('Credenciales correctas, ¡bienvenido!');
            window.location.href = 'perfil.html'
        }).catch(function (error) {
        console.log(error);
        alert(error.message);
    });
});

// Registro con correo
$('#registrarse').click(function () {
    const email = document.getElementById("signup-email-reg").value;
    const password = document.getElementById("signup-password-reg").value;
    // const nombre = document.getElementById("signup-password-reg").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (result) {
            let usuario = {
                uid: result.user.uid,
                nombre: result.user.email,
                email: result.user.email,
                img: "https://graph.facebook.com/3498960506864413/picture",
            }
            db.collection("users").doc(result.user.uid).set(usuario)
            console.log('Usuario nuevo registrado');
            alert('Usuario nuevo registrado');
        }).catch(function (error) {
        console.error(error)
        alert(error.message);
    });
});

// Cerrar sesión
$('#logout').click(function () {
    firebase.auth().signOut()
        .then(function () {
            console.log('Salir');
            alert('Salir');
        }).catch(function (error) {
        console.log(error);
    });
})

//Revisa si ya se inició sesión
$('#aceptarPerfil').click(function () {
    const rol = document.getElementById("signup-rol-reg").value;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let usuario = {
                uid: user.uid,
                rol: rol
            }
            db.collection("users").doc(user.uid).update(usuario)
                .then(function () {
                    if (usuario.rol == "scout") {
                        console.log(usuario.rol);
                        window.location.href = 'scout.html'
                    } else if (usuario.rol == "entrenador") {
                        console.log(usuario.rol);
                        window.location.href = 'https://www.fifaindex.com/es-mx/'
                    } else if (usuario.rol == "periodista") {
                        console.log(usuario.rol);
                        window.location.href = 'https://www.fifaindex.com/es-mx/'
                    } else if (usuario.rol == "jugador") {
                        console.log(usuario.rol);
                        window.location.href = 'https://www.fifaindex.com/es-mx/'
                    }
                }).catch(function (error) {
                console.error("Error writing database: ", error);
            });
        } else {
            // User is signed out.
            // ...
        }
    });
});

//Guarda atributos de usuarios en la colección users
function guardarDatos(user) {
    let usuario = {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        img: user.photoURL
    }
    db.collection("users").doc(user.uid).set(usuario)
        .then(function () {
            window.location.href = 'perfil.html'
        }).catch(function (error) {
        console.error("Error writting database:", error)
    });
}

//Actualiza en tiempo real foto de perfil de Google
db.collection("users").onSnapshot(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        $('#root').append("<img src='" + doc.data().img + "' alt='imagen usuario'/>")
    });
})

//Muestra datos de jugadores en la tabla scout.html
let tabla = document.getElementById('tabla');
db.collection("players").onSnapshot((querySnapshot) => { //onSnapshot actualiza en tiempo real
    tabla.innerHTML = ''; // limpiar tabla
    console.clear();     // limpiar consola
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().Nombre}`);
        tabla.innerHTML += `
        <tr>
            <th scope="row"></th>
            <td>${doc.data().Nombre}
            <a href="https://www.fifaindex.com/es-mx/player/140233/guillermo-ochoa/fifa20/"><img src="${doc.data().Imagen}" width="60" height="60" alt="${doc.data().altImagen}"></a>
            </td>
            <td>${doc.data().Edad}</td>
            <td>${doc.data().Nacionalidad}
            <a href="#"><img src="${doc.data().bandera}" width="40" height="40"></a>
            <td>${doc.data().Equipo}
            <a href="https://www.fifaindex.com/es-mx/team/45/juventus/fifa20/"><img src="${doc.data().banderaEquipo}" width="30" height="30" alt="${doc.data().altImagenEquipo}"></a>
            </td>
            <td>${doc.data().Posicion}
            </td>
        </tr>`
    });
});





