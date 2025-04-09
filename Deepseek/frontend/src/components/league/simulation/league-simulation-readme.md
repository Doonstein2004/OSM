# LeagueSimulation - Refactorización

## Visión General

Esta refactorización transforma el componente `LeagueSimulation` de un archivo monolítico con ~260 líneas a una estructura modular y organizada. El componente permite a los usuarios seleccionar equipos para una liga y luego simular los partidos entre estos equipos.

## Estructura de Carpetas

```
components/
  └── league/
      └── simulation/
          ├── index.js                 # Componente principal LeagueSimulation
          ├── SimulationHeader.js      # Encabezado con título
          ├── TeamSelector.js          # Selector de equipos para añadir
          ├── SelectedTeams.js         # Lista de equipos seleccionados
          ├── SimulationButton.js      # Botón para simular liga
          ├── LoadingState.js          # Estado de carga
          └── StatusMessages.js        # Mensajes de éxito/error

utils/
  ├── api/
  │   └── simulationService.js         # Servicios API para simulación
  └── validators/
      └── simulationValidators.js      # Validación para simulación
```

## Componentes

### 1. LeagueSimulation (index.js)

El componente principal que:
- Gestiona el estado global (equipos, carga, errores)
- Coordina la carga inicial de datos (liga, equipos)
- Maneja las operaciones de añadir/eliminar equipos
- Gestiona el proceso de simulación
- Orquesta la interacción entre componentes hijos

### 2. SimulationHeader

Muestra:
- Título de la sección con icono
- Nombre de la liga actual
- Separador visual

### 3. TeamSelector

Proporciona:
- Selector desplegable para elegir equipos disponibles
- Botón para añadir el equipo seleccionado a la liga
- Mensajes informativos sobre el estado de selección

### 4. SelectedTeams

Muestra:
- Contador de equipos seleccionados (actuales/máximo)
- Lista de chips con los equipos añadidos
- Opción para eliminar equipos de la liga
- Mensaje informativo cuando no hay equipos seleccionados

### 5. SimulationButton

Proporciona:
- Botón principal para iniciar la simulación
- Indicador de carga durante el proceso
- Estado deshabilitado cuando no es posible simular

### 6. LoadingState y StatusMessages

Muestran:
- Estado de carga durante la obtención de datos
- Mensajes de éxito y error para feedback al usuario

## Utilidades

### 1. simulationService.js

Contiene:
- Funciones para obtener datos de ligas y equipos
- Operaciones para añadir/eliminar equipos
- Función para simular la liga
- Carga inicial optimizada con Promise.all

### 2. simulationValidators.js

Proporciona:
- Validación para añadir equipos
- Validación para simular la liga
- Comprobación de requisitos mínimos

## Flujo de Datos

1. El componente principal carga datos iniciales al montarse
2. El usuario selecciona y añade equipos a la liga
3. Cada adición/eliminación se realiza inmediatamente en el backend
4. El estado local y UI se actualizan tras cada operación
5. Al iniciar la simulación, se procesan todos los partidos
6. Se notifica al componente padre del resultado mediante callback

## Beneficios de la Refactorización

1. **Mejor Separación de Responsabilidades**: Cada componente tiene un propósito específico
2. **Mantenibilidad Mejorada**: Componentes más pequeños y enfocados
3. **Reutilización**: Componentes como `StatusMessages` y `LoadingState` son reutilizables
4. **Legibilidad**: Estructura clara y organizada
5. **Testabilidad**: Componentes aislados más fáciles de probar

## Uso

```jsx
import LeagueSimulation from './components/league/simulation';

function LeagueDetailPage() {
  const handleSimulationComplete = () => {
    console.log('Simulación completada, actualizando datos...');
    // Lógica para actualizar otros componentes
  };

  return (
    <div>
      <h1>Detalle de Liga</h1>
      <LeagueSimulation 
        leagueId="123"
        onSimulationComplete={handleSimulationComplete}
      />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Simulación Parcial**: Permitir simular solo ciertas jornadas o partidos específicos
2. **Previsualización**: Añadir una vista previa de los emparejamientos antes de simular
3. **Estado de Simulación**: Mostrar progreso detallado durante la simulación
4. **Configuración Avanzada**: Permitir ajustar parámetros de simulación
5. **Historial**: Mantener un historial de simulaciones anteriores