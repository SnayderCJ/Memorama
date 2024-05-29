document.addEventListener('DOMContentLoaded', function () {
  // Obtener los elementos de audio
  const sonidoClic = document.getElementById('sonidoClic');

  // Obtener todos los elementos de la página
  const elementos = document.getElementsByTagName('*');

  // Agregar un evento de clic a cada elemento
  for (let i = 0; i < elementos.length; i++) {
    elementos[i].addEventListener('click', function () {
      // Reproducir el sonido al hacer clic
      sonidoClic.play();
    });
  }

});

const sonidoAcierto = new Audio('/EfectosDeSonido/validacion2.mp3');
const sonidoError = new Audio('/EfectosDeSonido/error2.mp3');