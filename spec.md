# Especificación de Memorama (SDD)

## Contexto
Memorama es un juego clásico de memoria. Queremos modernizarlo con una interfaz "premium", diferentes niveles de dificultad, temáticas (decks) y un sistema de puntuación para hacerlo comercialmente viable.

## Usuarios
- **Jugador Casual:** Quiere jugar partidas rápidas sin complicaciones, buscando entretenimiento visual y auditivo.
- **Jugador Competitivo:** Quiere retarse a sí mismo, superar su "Mejor Puntaje" y jugar en dificultades altas.

## Requisitos Funcionales (Notación EARS)

### Flujo Principal (Juego Básico)
- **RF-1:** *While* en el tablero de juego, el sistema *shall* mostrar una cuadrícula de cartas boca abajo según la dificultad seleccionada.
- **RF-2:** *When* el jugador hace clic en una carta boca abajo, el sistema *shall* voltear la carta para mostrar su contenido.
- **RF-3:** *If* el jugador voltea una segunda carta en el mismo turno, el sistema *shall* bloquear temporalmente el tablero para evitar más interacciones.
- **RF-4:** *If* las dos cartas volteadas coinciden, el sistema *shall* marcarlas como encontradas, reproducir una animación de éxito, y sumar puntos al jugador.
- **RF-5:** *If* las dos cartas volteadas no coinciden, el sistema *shall* ocultarlas nuevamente después de 800ms.
- **RF-6:** *When* el jugador encuentra todas las parejas, el sistema *shall* mostrar la pantalla de victoria con su puntuación final y actualizar el "Mejor Puntaje" si aplica.

### Dificultad y Temáticas
- **RF-7:** *While* en la pantalla de inicio, el jugador *shall* poder elegir entre las dificultades: Fácil (4x4), Medio (6x6) y Difícil (8x8).
- **RF-8:** *While* en la pantalla de inicio, el jugador *shall* poder elegir un tema de cartas (ej. Emojis, Animales).

### Puntuación y Tiempo
- **RF-9:** *While* la partida está activa, el sistema *shall* mostrar el número de intentos realizados.
- **RF-10:** *While* la partida está activa, el sistema *shall* mostrar un temporizador que cuenta el tiempo transcurrido desde el primer clic.

## Fuera de Alcance (MVP Actual)
- Multijugador en tiempo real.
- Leaderboard global con backend.

## Criterios de Finalización (Definition of Done)
- El juego es completamente funcional sin errores de consola.
- La interfaz se adapta a dispositivos móviles y de escritorio.
- El estado (puntuación/tema) se gestiona a través de custom hooks (`useMemorama`).
- El diseño incluye CSS Vanilla premium (animaciones suaves, glassmorphism, sombras).
