const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];

let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let intentos = 0;
let parejasEncontradas = 0;

const tableroEl = document.getElementById('tablero');
const intentosEl = document.getElementById('intentos');
const parejasEl = document.getElementById('parejas');
const totalParejasEl = document.getElementById('total-parejas');
const mensajeVictoriaEl = document.getElementById('mensaje-victoria');
const intentosFinalEl = document.getElementById('intentos-final');

function barajar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function iniciarJuego() {
  cartas = barajar([...EMOJIS, ...EMOJIS]);
  primeraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  intentos = 0;
  parejasEncontradas = 0;

  totalParejasEl.textContent = EMOJIS.length;
  actualizarMarcador();
  mensajeVictoriaEl.hidden = true;

  tableroEl.innerHTML = '';
  cartas.forEach((emoji, index) => {
    const carta = document.createElement('div');
    carta.className = 'carta';
    carta.dataset.emoji = emoji;
    carta.dataset.index = index;
    carta.innerHTML = `
      <span class="contenido">${emoji}</span>
      <span class="reverso">❓</span>
    `;
    carta.addEventListener('click', () => voltearCarta(carta));
    tableroEl.appendChild(carta);
  });
}

function voltearCarta(carta) {
  if (bloqueado) return;
  if (carta === primeraCarta) return;
  if (carta.classList.contains('encontrada')) return;

  carta.classList.add('volteada');

  if (!primeraCarta) {
    primeraCarta = carta;
    return;
  }

  segundaCarta = carta;
  bloqueado = true;
  intentos++;
  actualizarMarcador();

  if (primeraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
    primeraCarta.classList.add('encontrada');
    segundaCarta.classList.add('encontrada');
    parejasEncontradas++;
    actualizarMarcador();
    resetearSeleccion();

    if (parejasEncontradas === EMOJIS.length) {
      setTimeout(mostrarVictoria, 400);
    }
  } else {
    setTimeout(() => {
      primeraCarta.classList.remove('volteada');
      segundaCarta.classList.remove('volteada');
      resetearSeleccion();
    }, 800);
  }
}

function resetearSeleccion() {
  primeraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}

function actualizarMarcador() {
  intentosEl.textContent = intentos;
  parejasEl.textContent = parejasEncontradas;
}

function mostrarVictoria() {
  intentosFinalEl.textContent = intentos;
  mensajeVictoriaEl.hidden = false;
}

document.getElementById('btn-reiniciar').addEventListener('click', iniciarJuego);
document.getElementById('btn-jugar-de-nuevo').addEventListener('click', iniciarJuego);

iniciarJuego();
