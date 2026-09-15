<div align="center">
  <h1>🧠 Memorama Premium</h1>
  <p><strong>El clásico juego de memoria, llevado al límite arquitectónico moderno.</strong></p>
  
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

**Memorama Premium** no es solo un juego de emparejar cartas; es una **Progressive Web App (PWA)** desarrollada con React y Vite, diseñada para ofrecer una experiencia *Enterprise-Grade* con una interfaz de usuario hiper-realista, animaciones físicas, soporte multi-idioma, y una banda sonora nativa de 8-bits generada con algoritmos matemáticos.

> [!TIP]
> **¡Instálalo como App Nativa!**
> Gracias a su arquitectura PWA y sus Service Workers, puedes abrir el juego en tu celular (iOS/Android) o computadora, instalarlo en tu escritorio y **jugar 100% Offline** sin conexión a internet.

---

## 🚀 Características Principales

### 🎮 Modos de Juego
- **Modo Solitario:** Encuentra las parejas en el menor tiempo posible para establecer tu récord.
- **Modo Contrarreloj (Time Attack):** ¡60 segundos en el reloj! Cada acierto te da 5 segundos extra. Si llegas a 0, Game Over.
- **Multijugador Local (1 vs 1):** Juega con un amigo en la misma pantalla. La app gestiona los turnos y los puntajes de manera inteligente.

### 🎨 Diseño y UX de Vanguardia
- **Floating Dock:** Interfaz estilo macOS en la parte inferior para una navegación ergonómica en móviles.
- **Temas Dinámicos:** Cambia entre **Modo Oscuro** (Mesh Gradient) y **Modo Claro** en tiempo real.
- **Framer Motion:** Animaciones físicas con inercia y rebote para las cartas y ventanas modales.
- **Multi-Idioma (i18n):** Interfaz traducida instantáneamente a Español e Inglés.

### 🎵 Inmersión Total
- **Música de Fondo (BGM):** Arpegios nostálgicos sintetizados nativamente en el navegador vía *Web Audio API*.
- **Combos y Pistas:** Gana multiplicadores de puntos por aciertos consecutivos. Usa tus puntos para comprar "Pistas" visuales.
- **Perfiles Locales:** Elige tu Avatar (👽👻🤖) y tu Nombre. Tus estadísticas y victorias se guardan en el historial del navegador automáticamente (`localStorage`).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend Core:** React, Vite.
- **Animaciones:** Framer Motion, Canvas Confetti.
- **Estilos:** CSS Vanilla puro (Glassmorphism, CSS Variables para temas).
- **Iconografía:** Lucide React.
- **Audio:** Web Audio API (Sintetizador nativo, 0 dependencias).
- **Testing:** Vitest, React Testing Library.
- **PWA:** Vite PWA Plugin.

---

## ⚙️ Instalación y Uso Local

> [!IMPORTANT]
> Requisitos previos: Node.js instalado en tu máquina.

1. **Clona o descarga este repositorio.**
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
4. **Disfruta del juego** abriendo `http://localhost:5173/` en tu navegador.

---

## 🧪 Pruebas Automatizadas (Testing)

El motor lógico central del juego (`useMemorama.js`) está protegido con pruebas unitarias para asegurar que los temporizadores, multiplicadores y el sistema multijugador jamás fallen.

Para ejecutar los tests matemáticos, utiliza el comando:
```bash
npm run test
```

---

<div align="center">
  <i>Construido con SDD (Spec-Driven Development) bajo la premisa: <strong>"Que el código diga la verdad, y la especificación también".</strong></i>
</div>
