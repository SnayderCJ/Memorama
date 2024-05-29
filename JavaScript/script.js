var iconoRegresar = document.getElementById("regresar");

iconoRegresar.addEventListener("click", function() {
    regresarAInicio();
    iconoRegresar.style.display = "none";
});


const regresarAInicio = () => {
   
    var nuevoJuego = document.getElementById("nuevo-juego");
    nuevoJuego.style.display = "block";

    var opcionesJuego = document.querySelectorAll(".opcion-modo");
    opcionesJuego.forEach(function(opcion) {
        opcion.style.display = "none";
    });

}

const mostrarOpcionesJuego = () => {

    var nuevoJuego = document.getElementById("nuevo-juego");
    nuevoJuego.style.display = "none"; //! Ocultar

    var opcionesJuego = document.querySelectorAll(".opcion-modo");
    opcionesJuego.forEach(function(opcion) {
        opcion.style.display = "block"; //! Mostrar
    });

    // Muestra el ícono de regresar
    var iconoRegresar = document.getElementById("regresar");
    iconoRegresar.style.display = "block";
}
