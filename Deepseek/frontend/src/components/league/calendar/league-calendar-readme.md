# LeagueCalendar - Refactorización

## Visión General

Este documento describe la refactorización del componente `LeagueCalendar` que originalmente era un componente monolítico de más de 400 líneas. La refactorización ha transformado el componente en una estructura modular y mantenible, separando responsabilidades y mejorando la reutilización de código.

## Estructura de Carpetas

```
components/
  └── league/
      └── calendar/
          ├── index.js                # Componente principal LeagueCalendar
          ├── CalendarHeader.js       # Encabezado con controles
          ├── MatchesList.js          # Lista de partidos
          ├── MatchCard.js            # Tarjeta de partido individual
          ├── MatchForm.js            # Formulario para crear/editar partidos
          ├── EmptyState.js           # Estado cuando no hay partidos
          └── LoadingState.js         # Estado de carga

utils/
  ├── api/
  │   └── calendar.js                 # Funciones de API
  └── validators/
      └── matchValidators.js          # Validación de datos
```

## Componentes

### 1. LeagueCalendar (index.js)

El componente principal que:
- Gestiona los estados
- Coordina la carga de datos
- Maneja las operaciones (crear, editar, eliminar partidos)
- Orquesta la interacción entre los componentes hijos

### 2. CalendarHeader

Muestra:
- Título del calendario
- Selector de jornada
- Botones de acción (agregar partido, generar calendario)

### 3. MatchesList

Responsable de:
- Agrupar partidos por fecha
- Renderizar cada grupo en una tarjeta
- Pasar las acciones adecuadas a cada partido

### 4. MatchCard

Muestra:
- Información de un partido individual (equipos, hora)
- Botones de acción (editar, eliminar)

### 5. MatchForm

Formulario para:
- Crear nuevos partidos
- Editar partidos existentes
- Validar los datos del formulario

### 6. EmptyState y LoadingState

Muestran estados específicos:
- Estado de carga mientras se obtienen los datos
- Estado vacío cuando no hay partidos en la jornada seleccionada

## Utilidades

### 1. calendar.js (API)

Encapsula todas las llamadas API:
- Obtener calendario y equipos
- Crear, actualizar y eliminar partidos
- Generar calendario automáticamente

### 2. matchValidators.js

Contiene:
- Funciones de validación para el formulario de partidos
- Funciones para preparar datos antes de enviarlos al API

## Flujo de Datos

1. El componente principal carga los datos al montarse
2. Los datos y acciones se pasan a los componentes hijos a través de props
3. Los cambios de estado se manejan en el componente principal
4. Las actualizaciones se propagan hacia abajo en el árbol de componentes

## Beneficios de la Refactorización

1. **Mantenibilidad**: Cada componente tiene una responsabilidad clara y un tamaño manejable
2. **Reutilización**: Componentes como MatchForm o MatchCard pueden reutilizarse en otras partes de la aplicación
3. **Legibilidad**: El código es más fácil de entender y seguir
4. **Testabilidad**: Los componentes más pequeños son más fáciles de probar
5. **Escalabilidad**: Se pueden añadir nuevas características sin modificar todo el código

## Uso

```jsx
import LeagueCalendar from './components/league/calendar';

function MatchesPage() {
  return (
    <div>
      <h1>Partidos</h1>
      <LeagueCalendar 
        leagueId={123} 
        onUpdate={() => console.log('Calendario actualizado')} 
      />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Manejo de errores**: Implementar un sistema más robusto de manejo de errores
2. **Paginación**: Añadir paginación para calendarios con muchos partidos
3. **Persistencia de preferencias**: Guardar la última jornada seleccionada
4. **Filtros adicionales**: Añadir más opciones de filtrado (por equipo, estado, etc.)
5. **Optimización de rendimiento**: Implementar memoización para evitar renderizados innecesarios