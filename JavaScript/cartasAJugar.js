// cartasAJugar.js

document.addEventListener("DOMContentLoaded", function () {
    // Obtener todas las imágenes con la clase "carta"
    const cartas = document.querySelectorAll('.cartas a');

    // Función para reproducir el sonido
    const reproducirSonido = () => {
        const sonido = document.getElementById('sonidoGamer');
        sonido.currentTime = 0; // Reiniciar el sonido si ya está reproduciéndose
        sonido.play();
    };

    // Agregar un evento de clic a cada imagen
    cartas.forEach(carta => {
        carta.addEventListener('click', () => {
            reproducirSonido(); // Reproducir el sonido al hacer clic en la imagen
            // Aquí puedes agregar cualquier otra lógica que desees al hacer clic en la imagen
        });
    });
});
