# Contexto de Memorama

## Acerca del Proyecto
- **Propósito:** Modernizar un juego de Memorama (pares) introduciendo valor comercial, diferentes niveles de dificultad, temáticas y un sistema de puntuación.
- **Tecnologías:** React, Vite, CSS Vanilla.
- **Metodología:** Spec-Driven Development (SDD). La única fuente de la verdad funcional es `spec.md`.

## Estilos y Reglas de Código
- Usar variables CSS para colores (Primary, Secondary, Background, Text) y diseño general.
- Incorporar principios modernos de diseño web: Glassmorphism, animaciones sutiles, fuentes modernas.
- Escribir componentes funcionales con hooks (`useState`, `useEffect`, `useCallback`).
- Mantener la lógica central del juego encapsulada en `src/hooks/useMemorama.js`.

## Proceso de Verificación
Antes de dar por completado un hito, se debe comprobar que los requerimientos de `spec.md` se cumplen a la perfección:
1. El tablero se bloquea al tener dos cartas descubiertas y no hay coincidencia.
2. La animación visual de acierto se lanza.
3. El reloj cuenta de manera correcta desde el primer click.
4. El "Mejor Puntaje" local se almacena en el navegador persistente (localStorage).
