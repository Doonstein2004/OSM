# LeagueList - Refactorización

## Visión General

Esta refactorización transforma el componente `LeagueList` de un archivo monolítico con ~370 líneas a una estructura modular y bien organizada. El componente muestra una lista de ligas disponibles con capacidad para expandir detalles de cada una, como su clasificación y acciones rápidas.

## Estructura de Carpetas

```
components/
  └── league/
      └── list/
          ├── index.js                 # Componente principal LeagueList
          ├── LeagueListHeader.js      # Encabezado con título y botón
          ├── LeagueItem.js            # Elemento individual de liga
          ├── LeagueDetails.js         # Detalles expandibles de liga
          ├── StandingsPodium.js       # Podio de clasificación
          ├── LeagueActions.js         # Acciones para una liga
          ├── LoadingState.js          # Estado de carga
          ├── ErrorState.js            # Estado de error
          └── EmptyState.js            # Estado sin ligas

utils/
  ├── api/
  │   └── leagueServices.js            # Servicios API para ligas
  └── helpers/
      └── countryHelpers.js            # Utilidades para países
```

## Componentes

### 1. LeagueList (index.js)

El componente principal que:
- Gestiona el estado de la lista de ligas
- Maneja la expansión/colapso de detalles
- Coordina la carga de datos
- Controla la navegación entre páginas
- Renderiza estados condicionales (carga, error, vacío)

### 2. LeagueListHeader

Muestra:
- Título de la sección "Ligas Disponibles"
- Botón para crear una nueva liga
- Separador visual

### 3. LeagueItem

Representa:
- Un elemento individual de liga en la lista
- Información básica (nombre, tipo, equipos, partidos)
- Avatar con bandera del país
- Chips de estado (activo/finalizado)
- Botón para expandir/colapsar detalles

### 4. LeagueDetails

Contiene:
- Sección expandible con detalles adicionales
- Podio de clasificación (si hay datos)
- Tarjeta de acciones
- Estado de carga durante la obtención de datos

### 5. StandingsPodium

Muestra:
- Los tres primeros equipos de la clasificación
- Avatares con indicación visual de posición (oro, plata, bronce)
- Información básica de cada equipo (puntos, resultados)

### 6. LeagueActions

Proporciona:
- Botones para navegar a diferentes secciones
- Acciones para ver partidos, tabla y estadísticas

### 7. Estados (Loading, Error, Empty)

Muestran:
- Estado de carga durante la obtención de datos
- Mensajes de error en caso de fallos
- Mensaje cuando no hay ligas disponibles

## Utilidades

### 1. leagueServices.js

Contiene:
- `fetchLeagues`: Obtener lista de ligas
- `fetchLeagueDetails`: Obtener detalles de una liga
- `fetchLeagueStandings`: Obtener clasificación
- `fetchLeagueFullDetails`: Obtener detalles completos en una sola llamada

### 2. countryHelpers.js

Proporciona:
- `getCountryFlag`: Obtener la URL de la bandera de un país
- `getCommonCountries`: Lista de países comunes para ligas

## Flujo de Datos

1. El componente principal carga la lista de ligas al montarse
2. El usuario puede expandir una liga para ver más detalles
3. Al expandir, se cargan datos adicionales si no están ya en caché
4. Los botones de acción permiten navegar a diferentes secciones
5. Estados condicionales para diferentes situaciones (carga, error, vacío)

## Beneficios de la Refactorización

1. **Mejor Separación de Responsabilidades**: Cada componente tiene un propósito específico
2. **Mantenibilidad Mejorada**: Componentes más pequeños y enfocados
3. **Reutilización**: Componentes como `LoadingState` o `ErrorState` son reutilizables
4. **Legibilidad**: Estructura clara y organizada
5. **Testabilidad**: Componentes aislados más fáciles de probar

## Uso

```jsx
import LeagueList from './components/league/list';

function LeaguesPage() {
  return (
    <div>
      <h1>Ligas</h1>
      <LeagueList />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Paginación**: Implementar paginación para manejar listas grandes de ligas
2. **Filtrado y Búsqueda**: Añadir capacidades de filtrado y búsqueda
3. **Memorización**: Usar `React.memo` o `useMemo` para optimizar rendimiento
4. **Caché de Datos**: Implementar una estrategia de caché más sofisticada
5. **Vista de Cuadrícula**: Opción para alternar entre vista de lista y cuadrícula