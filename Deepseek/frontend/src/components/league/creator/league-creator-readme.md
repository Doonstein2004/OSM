# LeagueCreatorManager - Refactorización

## Visión General

Esta refactorización transforma el componente `LeagueCreatorManager` de un solo archivo monolítico de más de 400 líneas en una estructura modular, mantenible y bien organizada. El componente se encarga de gestionar el creador/manager de una liga, permitiendo seleccionar un manager existente o crear uno personalizado.

## Estructura de Carpetas

```
components/
  └── league/
      └── creator/
          ├── index.js                  # Componente principal LeagueCreatorManager
          ├── CreatorHeader.js          # Encabezado con título y botón de expansión
          ├── InfoSection.js            # Sección colapsable con información
          ├── CurrentManagerCard.js     # Tarjeta que muestra el creador actual
          ├── ManagerSelector.js        # Selector de manager existente
          └── CustomManagerForm.js      # Formulario para crear un manager personalizado

utils/
  ├── api/
  │   └── leagueManager.js              # Funciones de API para gestionar creadores
  └── models/
      └── managerData.js                # Funciones para manipular datos de managers
```

## Componentes

### 1. LeagueCreatorManager (index.js)

El componente principal que:
- Gestiona los estados de la aplicación
- Coordina la carga de datos
- Maneja las operaciones de actualización
- Orquesta la interacción entre los componentes hijos

### 2. CreatorHeader

Responsable de:
- Mostrar el encabezado de la tarjeta
- Proporcionar el botón para expandir/contraer la sección de información

### 3. InfoSection

Muestra:
- Información colapsable sobre el rol del creador de liga
- Solo aparece cuando se expande

### 4. CurrentManagerCard

Muestra:
- Información del manager actual
- Avatar con indicador de verificación cuando corresponde
- Nombre e ID del manager

### 5. ManagerSelector

Proporciona:
- Selector desplegable para elegir un manager existente
- Opción para cambiar a modo de creación personalizada
- Indicadores visuales de verificación para cada manager

### 6. CustomManagerForm

Permite:
- Ingresar datos para un manager personalizado (ID y nombre)
- Validación básica de campos
- Volver al selector estándar

## Utilidades

### 1. leagueManager.js (API)

Encapsula todas las llamadas API relacionadas con managers:
- `updateLeagueCreator`: Actualiza el creador de una liga
- `fetchManagers`: Obtiene la lista de managers disponibles (simulada)

### 2. managerData.js (Modelos)

Contiene funciones para manipular datos de managers:
- `formatManagerData`: Formatea los datos para enviar a la API
- `getDummyManagers`: Proporciona datos simulados para desarrollo

## Flujo de Datos

1. El componente principal carga los managers disponibles al iniciar
2. Los datos y manejadores se pasan a los componentes hijos
3. El usuario interactúa con el selector o formulario personalizado
4. Al guardar, se formatean los datos y se envían a la API
5. Se muestra retroalimentación (éxito o error) al usuario

## Beneficios de la Refactorización

1. **Mejor Organización**: Cada componente tiene una responsabilidad clara
2. **Mantenibilidad**: Componentes más pequeños y enfocados
3. **Reutilización**: Componentes como CurrentManagerCard pueden usarse en otros contextos
4. **Testabilidad**: Más fácil escribir pruebas para componentes individuales
5. **Legibilidad**: El código es más fácil de entender y seguir

## Uso

```jsx
import LeagueCreatorManager from './components/league/creator';

function LeagueDetailsPage() {
  const league = {
    id: 1,
    name: 'Liga Ejemplo',
    creator: { id: 'manager1', name: 'José Mourinho' }
  };

  const handleUpdate = () => {
    console.log('Liga actualizada');
  };

  return (
    <div>
      <h1>Detalles de la Liga</h1>
      <LeagueCreatorManager 
        league={league}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Implementar PropTypes o TypeScript**: Mejorar la documentación y verificación de tipos
2. **Agregar Pruebas Unitarias**: Crear tests para cada componente
3. **Mejorar Validación**: Añadir validación más robusta para el formulario
4. **Mensaje de Confirmación**: Añadir confirmación antes de realizar cambios importantes
5. **Soporte para Imágenes**: Permitir subir avatares para los managers