# LeagueDeletionManager - Refactorización

## Visión General

Esta refactorización transforma el componente `LeagueDeletionManager` de un archivo monolítico con ~280 líneas en una estructura modular y bien organizada. El componente gestiona el proceso de eliminación de una liga, incluyendo una interfaz para confirmar la acción y realizar la operación.

## Estructura de Carpetas

```
components/
  └── league/
      └── deletion/
          ├── index.js                 # Componente principal LeagueDeletionManager
          ├── DeletionHeader.js        # Encabezado con título y botón de expansión
          ├── InfoSection.js           # Sección colapsable con advertencias
          ├── DeletionCard.js          # Tarjeta con detalles y botón de eliminación
          └── ConfirmationDialog.js    # Diálogo de confirmación con validación

utils/
  └── api/
      └── leagueOperations.js          # Funciones de API para operaciones con ligas
```

## Componentes

### 1. LeagueDeletionManager (index.js)

El componente principal que:
- Gestiona los estados de la aplicación (carga, error, diálogo)
- Coordina las acciones de eliminación
- Maneja la navegación tras la eliminación
- Orquesta la interacción entre los componentes hijos

### 2. DeletionHeader

Responsable de:
- Mostrar el encabezado "Zona de Peligro"
- Proporcionar el botón para expandir/contraer la información adicional

### 3. InfoSection

Muestra:
- Información colapsable sobre las consecuencias de eliminar una liga
- Advertencias sobre la irreversibilidad de la acción

### 4. DeletionCard

Muestra:
- Información detallada sobre lo que implica eliminar la liga
- Botón principal para iniciar el proceso de eliminación

### 5. ConfirmationDialog

Proporciona:
- Diálogo modal para confirmar la acción
- Campo de texto para verificación de seguridad
- Validación del texto de confirmación
- Botones para cancelar o confirmar

## Utilidades

### leagueOperations.js (API)

Contiene:
- `deleteLeague`: Función para eliminar una liga por su ID
- `getExpectedConfirmationText`: Función para generar el texto de confirmación esperado

## Flujo de Datos

1. El usuario ve la tarjeta de eliminación con información y advertencias
2. Al hacer clic en "Eliminar Liga", se abre el diálogo de confirmación
3. El usuario debe escribir el texto exacto para confirmar
4. Si el texto coincide, se habilita el botón de confirmación
5. Al confirmar, se realiza la llamada a la API
6. Se muestra retroalimentación y se navega a la lista de ligas

## Beneficios de la Refactorización

1. **Mejor Separación de Responsabilidades**: Cada componente tiene una función clara
2. **Mantenibilidad Mejorada**: Componentes más pequeños y enfocados
3. **Reutilización**: El diálogo de confirmación podría usarse para otras operaciones destructivas
4. **Legibilidad**: Estructura clara y organizada
5. **Testabilidad**: Más fácil escribir pruebas para cada componente

## Uso

```jsx
import LeagueDeletionManager from './components/league/deletion';

function LeagueDetailsPage() {
  return (
    <div>
      <h1>Detalles de la Liga</h1>
      <LeagueDeletionManager 
        leagueId={123}
        leagueName="Liga de Ejemplo"
      />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Agregar Opciones de Seguridad**: Como autenticación adicional para operaciones destructivas
2. **Reforzar Validación**: Añadir más capas de confirmación para operaciones críticas
3. **Mensajes Personalizables**: Permitir personalizar los mensajes de advertencia
4. **Eventos de Auditoría**: Registrar quién y cuándo realizó operaciones destructivas
5. **Restauración**: Implementar un sistema de papelera que permita restaurar ligas eliminadas