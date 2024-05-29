//! Sonidos:

const sonidoCronometro = new Audio('/EfectosDeSonido/tiempocayendo2.mp3');
let sonidoCronometroActivo = false;


const params = new URLSearchParams(window.location.search);
const estiloSeleccionado = params.get("estilo") || "onePiece";
const totalCartas = 20;
let cartas = [];
let cartasSeleccionadas = [];
let movimientoActual = 0;
let intentosActuales = 0;
let puntuacion = 0;
let turnoActual = 1;
let puntuacion2 = 0;
let intentosActuales2 = 0;

let tiempoRestante = 150;
let temporizador;

let nombreJugador;
let nombreJugador2;

const plantillaCarta = `
  <div class="carta">
    <div class="trasera"></div>
    <div class="cara"></div>
  </div>
`;

const puntuacionElement = document.querySelector("#puntuacion");
const estadisticasElement = document.querySelector("#estadisticas");
const nombreJugadorElement = document.querySelector("#nombreJugador");
const nombreJugadorElement2 = document.querySelector("#nombreJugador2");
const estadisticasElement2 = document.querySelector("#estadisticas2");
const puntuacionElement2 = document.querySelector("#puntuacion2");
const turnoElement = document.querySelector("#turno");

window.onload = function () {
  nombreJugador = prompt(
    "¡Bienvenido!, Jugador 1, Por favor, ingresa tu nombre:"
  );
  nombreJugador2 = prompt(
    "¡Bienvenido!, Jugador 2, Por favor, ingresa tu nombre:"
  );
  if (
    nombreJugador === null ||
    nombreJugador === "" ||
    nombreJugador2 === null ||
    nombreJugador2 === ""
  ) {
    nombreJugador = "Invitado";
    nombreJugador2 = "Invitado2";
  }

  localStorage.setItem("nombreJugador", nombreJugador);
  localStorage.setItem("nombreJugador2", nombreJugador2);

  alert(
    `Bienvenido, Jugador 1: ${nombreJugador} y Jugador 2: ${nombreJugador2}. Disfruten del juego.`
  );

  nombreJugadorElement.innerHTML = `Jugador 1: <br>${nombreJugador} `;
  nombreJugadorElement2.innerHTML = `Jugador 2: <br>${nombreJugador2}`;
  turnoElement.innerHTML = `Turno del Jugador ${turnoActual}`;
};

//! Contador:

const iniciarContador = () => {
  temporizador = setInterval(actualizarContador, 1000); 
};

const actualizarContador = () => {
  tiempoRestante--;

  const porcentajeTiempo = (tiempoRestante / 60) * 100;

  //? Actualiza el contenido del contador
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const formatoTiempo = `${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
  document.getElementById("tiempo").innerHTML = formatoTiempo;

  document.getElementById("barraProgreso").style.width = porcentajeTiempo + "%";

  if (tiempoRestante <= 10) {
    document.getElementById("contador").classList.add("agotando");

    if (!sonidoCronometroActivo) {
      sonidoCronometro.play();
      sonidoCronometroActivo = true;
    }
  }

  if (tiempoRestante <= 0) {
    clearInterval(temporizador);
    finalizarJuegoPorTiempo();
  }
};

const finalizarJuegoPorTiempo = () => {
  const mensaje = `¡Tiempo agotado! Juego terminado.\n${nombreJugador}: Movimientos: ${intentosActuales}, Puntuación final: ${puntuacion}
  \n${nombreJugador2}: Movimientos: ${intentosActuales2}, Puntuación final: ${puntuacion2}`;
  alert(mensaje);

  determinarGanador();
};

const activar = (e) => {
  const cartaSeleccionada = e.target.closest('.carta');

  if (!cartaSeleccionada || movimientoActual === 2 || cartaSeleccionada.classList.contains('activa') || cartaSeleccionada.classList.contains('igual')) {
    return; // Salir de la función si no es una carta válida
  }

  cartaSeleccionada.classList.add('activa');
  cartasSeleccionadas.push(cartaSeleccionada);

  if (++movimientoActual === 2) {
    if (turnoActual === 1) {
      intentosActuales++;
    } else {
      intentosActuales2++;
    }

    const [imagen1, imagen2] = cartasSeleccionadas.map(
      (carta) => carta.querySelector(".cara").style.backgroundImage
    );

    setTimeout(() => {
      if (imagen1 === imagen2) {
        cartasSeleccionadas.forEach((carta) => {
          carta.classList.add("igual");
          carta.removeEventListener("click", activar);
        });
        if (turnoActual === 1) {
          puntuacion += 3;
          puntuacionElement.innerHTML = `Puntuación: ${puntuacion}`;
        } else {
          puntuacion2 += 3;
          puntuacionElement2.innerHTML = `Puntuación: ${puntuacion2}`;
        }

        if (todasCartasVolteadas()) {

          sonidoCronometro.pause()
          sonidoCronometro.currentTime = 0
          finalizarJuego();
        }
        sonidoAcierto.currentTime = 0;
        sonidoAcierto.play()
      } else {
        cartasSeleccionadas.forEach((carta) =>
          carta.classList.remove("activa")
        );
    
        sonidoError.currentTime = 0
        sonidoError.play()
        setTimeout(cambiarTurno, 500);
      }

      cartasSeleccionadas = [];
      movimientoActual = 0;

      // Reactivar clic en todas las cartas después de un breve tiempo
      cartas.forEach((carta) => {
        if (!carta.classList.contains("igual")) {
          carta.addEventListener("click", activar);
        }
      });

      actualizarEstadisticas();
    }, 600);
  }
};


const actualizarEstadisticas = () => {
  // estadísticas del Jugador 1
  estadisticasElement.innerHTML = `Movimientos: ${intentosActuales}`;
  puntuacionElement.innerHTML = `Puntuación: ${puntuacion}`;

  // estadísticas del Jugador 2
  estadisticasElement2.innerHTML = `Movimientos: ${intentosActuales2}`;
  puntuacionElement2.innerHTML = `Puntuación: ${puntuacion2}`;
};

const cambiarTurno = () => {
  turnoActual = turnoActual === 1 ? 2 : 1;
  nombreJugadorElement.innerHTML = `Jugador 1: <br>${nombreJugador} `;
  nombreJugadorElement2.innerHTML = `Jugador 2: <br>${nombreJugador2}`;
  turnoElement.innerHTML = `Turno del Jugador ${turnoActual}`;
};

const finalizarJuego = () => {
  const mensaje = `Juego terminado.\n${nombreJugador}: Movimientos: ${intentosActuales}, Puntuación final: ${puntuacion}
  \n${nombreJugador2}: Movimientos: ${intentosActuales2}, Puntuación final: ${puntuacion2}`;

  alert(mensaje);
  determinarGanador();
};

const determinarGanador = () => {
  let ganador;

  if (puntuacion > puntuacion2) {
    ganador = nombreJugador;
  } else if (puntuacion2 > puntuacion) {
    ganador = nombreJugador2;
  } else {
    ganador = "Empate";
  }

  alert(`¡El ganador es: ${ganador}!`);
  window.location.href = '/Html/final.html';
};

const todasCartasVolteadas = () => {
  return Array.from(document.querySelectorAll('.carta')).every(carta => carta.classList.contains('igual'));
};

const barajarCartas = () => {
  for (let i = totalCartas - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }

  const juego = document.querySelector("#juego");
  juego.innerHTML = "";
  cartas.forEach((carta) => juego.appendChild(carta)); // Agregar las cartas al juego
};


const iniciarJuego = () => {
  iniciarContador();
  cartas.forEach((carta) => {
    carta.addEventListener("click", activar);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Crear las cartas y barajar al cargar la página
  for (let i = 1; i <= totalCartas / 2; i++) {
    for (let j = 0; j < 2; j++) {
      const div = document.createElement("div");
      div.innerHTML = plantillaCarta;
      cartas.push(div);

      const rutaImagen = `/Imagenes/${estiloSeleccionado}/img${i}.jpeg`;
      const caraElement = cartas[cartas.length - 1].querySelector(".cara");
      caraElement.style.backgroundImage = `url('${rutaImagen}')`;
      cartas[cartas.length - 1].querySelector(
        ".trasera"
      ).style.backgroundImage = `url('/Imagenes/${estiloSeleccionado}/atras.jpeg')`;
    }
  }

  barajarCartas();
  setTimeout(iniciarJuego, 1000);
});
