# Manual del Administrador / Desarrollador (Memorama)

## Especificaciones de Funcionalidad y Fórmulas

### Puntuación (Scoring)
La puntuación no se basa solo en el número de aciertos, sino en la rapidez y la precisión:
1. **Puntos por Acierto:** 
   - Cada pareja encontrada otorga un puntaje base de **+100 puntos**.
   - Se le suma un bono de tiempo por rapidez: `Math.max(0, 50 - time)` al momento de encontrarla. Es decir, mientras menos segundos hayan pasado desde el inicio de la partida, mayor será el bono (hasta +50).
2. **Puntos de Victoria:**
   - Al ganar la partida (completar todas las parejas), se otorga un bono masivo por el tiempo total empleado: `Math.max(0, 1000 - time * 10)`.

### Dependencias y Librerías Añadidas
- `react`, `react-dom`
- `vite` (bundler)
- `lucide-react` (iconos vectoriales premium)
- `canvas-confetti` (efecto visual de celebración)

### Interfaz Global (Layout)
La aplicación envuelve las vistas en un `Layout` que proporciona una **Navbar** superior. Desde ahí, los usuarios pueden acceder a:
- **Manual de Juego:** (Modal de reglas).
- **Ajustes:** (Limpieza de puntuaciones altas).

### Modales
Los modales (`Modal.jsx`) emplean efectos de *backdrop-filter: blur* y un manejo seguro de eventos de click (para cerrarse al hacer click fuera del contenido).
