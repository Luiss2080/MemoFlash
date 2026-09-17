<div align="center">
  <h1>⚡ MemoFlash</h1>
  <p><strong>El clásico juego de memoria (memorama), reinventado como una PWA moderna, rápida e instalable.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

---

## 🌟 Descripción

**MemoFlash** no es solo un juego de emparejar cartas: es una **Progressive Web App (PWA)** construida con React y Vite, pensada para instalarse como una app nativa y jugarse offline, con interfaz "glassmorphism", animaciones físicas, soporte multi-idioma y una banda sonora de 8-bits generada en tiempo real con la Web Audio API (sin archivos de audio externos).

> [!TIP]
> **¡Instálalo como App Nativa!**
> Gracias a su Service Worker y manifiesto PWA (`vite-plugin-pwa`), puedes instalar MemoFlash en tu celular o computadora y jugar sin conexión a internet.

---

## 🚀 Características

### 🎮 Modos de juego
- **Modo Solitario:** encuentra todas las parejas en el menor tiempo y con los menos intentos posibles para superar tu Mejor Puntaje.
- **Contrarreloj (Time Attack):** empiezas con 60 segundos; cada acierto suma +5s; si el reloj llega a 0, termina la partida.
- **Multijugador Local (1 vs 1):** dos jugadores comparten pantalla y turno; cada fallo pasa el turno al otro jugador y cada uno lleva su propio marcador.

### 🃏 Dificultad y temas
- Tres dificultades: **Fácil** (4x4, 8 parejas), **Medio** (4x6, 12 parejas) y **Difícil** (6x6, 18 parejas).
- Cuatro mazos temáticos de emojis: Emojis de comida, Animales, Código/Tecnología y Banderas.

### 🏆 Puntuación
- +100 puntos por pareja encontrada, más un bono por rapidez (hasta +50).
- Multiplicador de combo: aciertos consecutivos multiplican los puntos del turno (x2, x3...); un fallo lo reinicia a cero.
- Pista: revela el tablero por 1 segundo a cambio de 200 puntos (requiere saldo suficiente).
- Bono de victoria al completar el tablero, mayor cuanto menor sea el tiempo total empleado.

### 🎨 Interfaz
- **Floating Dock:** navegación inferior estilo macOS con accesos a Perfil, Estadísticas, Manual, Tema y Configuración.
- **Modo Oscuro / Claro** intercambiable en tiempo real vía variables CSS.
- **Multi-idioma (i18n):** interfaz completa en Español e Inglés, con selector en Configuración.
- Cartas navegables por teclado (Tab + Enter/Espacio), además de mouse/touch.
- Perfil local (nombre + avatar) y estadísticas globales (partidas jugadas, victorias, tiempo total) persistidas en `localStorage`.

### 🎵 Audio
- Efectos de sonido (flip, acierto, error, victoria) y música de fondo generados en el navegador con osciladores de la **Web Audio API** — no se cargan archivos de audio.

---

## 🕹️ Cómo jugar

1. Elige dificultad, tema y modo (1 jugador / 2 jugadores / Contrarreloj) en la barra superior.
2. Voltea dos cartas por turno haciendo clic (o con teclado: `Tab` para navegar, `Enter`/`Espacio` para voltear).
3. Si coinciden, se quedan boca arriba y sumas puntos; si no, vuelven a ocultarse tras un breve instante.
4. Encuentra todas las parejas para ganar la partida y, si superas tu récord, se actualiza tu Mejor Puntaje.

---

## ⚙️ Instalación y uso local

Requisito: Node.js instalado.

```bash
# 1. Clona o descarga este repositorio
git clone <url-del-repositorio>
cd memorama-web

# 2. Instala las dependencias
npm install

# 3. Ejecuta el servidor de desarrollo
npm run dev
```

Abre `http://localhost:5173/` en tu navegador. Otros comandos disponibles:

```bash
npm run build     # build de producción
npm run preview   # sirve el build de producción localmente
npm run lint      # analiza el código con oxlint
```

---

## 🛠️ Tecnologías

- **Frontend:** React 19, Vite 8.
- **Animaciones:** Framer Motion, Canvas Confetti.
- **Estilos:** CSS puro con variables (Glassmorphism, temas claro/oscuro) — sin frameworks CSS.
- **Iconografía:** Lucide React.
- **Audio:** Web Audio API (sintetizador nativo, sin dependencias de audio).
- **PWA:** vite-plugin-pwa (Service Worker + manifiesto instalable).
- **Testing:** Vitest + React Testing Library.
- **Lint:** oxlint.

---

## 🧪 Tests

La lógica central del juego (`src/hooks/useMemorama.js`) — generación del mazo, detección de parejas, combos, condición de victoria, pistas y el modo Contrarreloj — está cubierta con pruebas unitarias con Vitest y React Testing Library.

```bash
npm test
```

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para el texto completo.

---

<div align="center">
  <i>Construido con SDD (Spec-Driven Development) bajo la premisa: <strong>"Que el código diga la verdad, y la especificación también".</strong></i>
</div>
