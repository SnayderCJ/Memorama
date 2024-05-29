//! Sonidos!
const sonidoCronometro = new Audio('/EfectosDeSonido/tiempocayendo2.mp3');
let sonidoCronometroActivo = false;

//! Logica de Un Jugador: 
const params = new URLSearchParams(window.location.search);
const estiloSeleccionado = params.get("estilo") || "onePiece";
const totalCartas = 20;
const cartas = [];
let cartasSeleccionadas = [];
let movimientoActual = 0;
let intentosActuales = 0;
let puntuacion = 0;

let tiempoRestante = 60;
let temporizador;

let nombreJugador;

const plantillaCarta = `
  <div class="carta">
    <div class="trasera"></div>
    <div class="cara"></div>
  </div>
`;

const puntuacionElement = document.querySelector('#puntuacion');
const estadisticasElement = document.querySelector('#estadisticas');

window.onload = function () {
  // Verificar si el nombre del jugador ya está almacenado en el Local Storage
 
    nombreJugador = prompt("¡Bienvenido! Por favor, ingresa tu nombre:");
    if (nombreJugador === null || nombreJugador === "") {
      nombreJugador = "Invitado";
    }

    // Guardar el nombre en el Local Storage
    localStorage.setItem('nombreJugador', nombreJugador);

  // Mostrar el mensaje de bienvenida con el nombre del jugador
  alert(`Bienvenido, ${nombreJugador}! Disfruta del juego.`);

  // Mostrar el nombre en el HTML
  document.getElementById('nombreJugador').innerHTML = nombreJugador;
};


//! Contador: 

const iniciarContador = () => {
  temporizador = setInterval(actualizarContador, 1000); // Actualizar cada segundo
};

const actualizarContador = () => {
  tiempoRestante--;

  // Calcula el porcentaje de tiempo restante
  const porcentajeTiempo = (tiempoRestante / 60) * 100;

  // Actualiza el contenido del contador
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const formatoTiempo = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  document.getElementById('tiempo').innerHTML = formatoTiempo;

  // Actualiza la anchura de la barra de progreso
  document.getElementById('barraProgreso').style.width = porcentajeTiempo + '%';

  // Aplica estilos adicionales cuando el tiempo es menor o igual a 10 segundos
  if (tiempoRestante <= 10) {
    document.getElementById('contador').classList.add('agotando');

    // Reproduce el sonido del cronómetro si no está activo
    if (!sonidoCronometroActivo) {
      sonidoCronometro.play();
      sonidoCronometroActivo = true;
    }
  }

  // Finaliza el juego si el tiempo se agota
  if (tiempoRestante <= 0) {
    clearInterval(temporizador);
    finalizarJuegoPorTiempo();
  }

  // Verifica si todas las cartas han sido emparejadas
  if (todasCartasVolteadas()) {
    alert(`¡Felicidades, ${nombreJugador}! Has encontrado todas las cartas. Puntuación final: ${puntuacion}`);
    finalizarJuego();
  }
};


const finalizarJuegoPorTiempo = () => {
  const mensaje = `¡Tiempo agotado, ${nombreJugador}! Juego terminado.\nMovimientos: ${intentosActuales}\nPuntuación final: ${puntuacion}`;
  alert(mensaje);
  
  window.location.href = '/Html/final.html';
};


const activar = (e) => {
  const cartaSeleccionada = e.target.closest('.carta');

  if (!cartaSeleccionada || movimientoActual === 2 || cartaSeleccionada.classList.contains('activa') || cartaSeleccionada.classList.contains('igual')) {
    return; // Salir de la función si no es una carta válida
  }

  cartaSeleccionada.classList.add('activa');
  cartasSeleccionadas.push(cartaSeleccionada);

  if (++movimientoActual === 2) {
    intentosActuales++;
    estadisticasElement.innerHTML = `Movimientos: ${intentosActuales}`;

    const [imagen1, imagen2] = cartasSeleccionadas.map(carta => carta.querySelector('.cara').style.backgroundImage);

    setTimeout(() => {
      if (imagen1 === imagen2) {
        cartasSeleccionadas.forEach(carta => {
          carta.classList.add('igual');
          carta.removeEventListener('click', activar);
        });
        puntuacion += 3; // Añadir puntuación por encontrar un par
        puntuacionElement.innerHTML = `Puntuación: ${puntuacion}`;

        sonidoAcierto.currentTime = 0;
        sonidoAcierto.play()
      } else {
        cartasSeleccionadas.forEach(carta => carta.classList.remove('activa'));

        sonidoError.currentTime = 0
        sonidoError.play()
      }

      cartasSeleccionadas = [];
      movimientoActual = 0;

      // Reactivar clic en todas las cartas después de un breve tiempo
      cartas.forEach(carta => {
        if (!carta.classList.contains('igual')) {
          carta.addEventListener('click', activar);
        }
      });
    }, 600);
  }
};

const barajarCartas = () => {
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }

  const juego = document.querySelector("#juego");
  juego.innerHTML = "";
  cartas.forEach(carta => juego.appendChild(carta));
};

const iniciarJuego = () => {
  iniciarContador();
  for (let i = 1; i <= totalCartas / 2; i++) {
    for (let j = 0; j < 2; j++) {
      const div = document.createElement("div");
      div.innerHTML = plantillaCarta;
      cartas.push(div);

      const rutaImagen = `/Imagenes/${estiloSeleccionado}/img${i}.jpeg`;
      const caraElement = cartas[cartas.length - 1].querySelector(".cara");
      caraElement.style.backgroundImage = `url('${rutaImagen}')`;
      cartas[cartas.length - 1].querySelector(".trasera").style.backgroundImage = `url('/Imagenes/${estiloSeleccionado}/atras.jpeg')`;
      cartas[cartas.length - 1].addEventListener("click", activar);
    }
  }

  barajarCartas();
};

const finalizarJuego = () => {
  const mensaje = `¡Juego terminado, ${nombreJugador}! Movimientos: ${intentosActuales}, Puntuación final: ${puntuacion}`;

  if (todasCartasVolteadas()) {
    sonidoCronometro.pause()
    sonidoCronometro.currentTime = 0

    alert(`¡Felicidades, ${nombreJugador}! Has encontrado todas las cartas. Puntuación final: ${puntuacion}`);
  } else {
    alert(mensaje);
  }

  window.location.href = '/Html/inicio.html';
};

const todasCartasVolteadas = () => {
  return Array.from(document.querySelectorAll('.carta')).every(carta => carta.classList.contains('igual'));
};

document.addEventListener("DOMContentLoaded", iniciarJuego);
