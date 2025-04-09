# LeagueInput - Refactorización

## Visión General

Esta refactorización transforma el componente `LeagueInput` de un archivo monolítico con ~330 líneas en una estructura modular y bien organizada. El componente gestiona la creación de nuevas ligas a través de un formulario que recopila toda la información necesaria.

## Estructura de Carpetas

```
components/
  └── league/
      └── input/
          ├── index.js                 # Componente principal LeagueInput
          ├── LeagueFormHeader.js      # Encabezado del formulario
          ├── NameSection.js           # Campo para nombre de liga
          ├── TypeSection.js           # Campos para tipo y país
          ├── SettingsSection.js       # Campos para equipos y jornadas
          ├── ManagerSection.js        # Información del manager
          ├── StatusMessages.js        # Mensajes de éxito/error
          └── FormActions.js           # Botones y acciones

utils/
  ├── api/
  │   └── leagueCreation.js            # Funciones de API
  └── validators/
      └── leagueFormValidators.js      # Validación de formulario
```

## Componentes

### 1. LeagueInput (index.js)

El componente principal que:
- Gestiona los estados del formulario
- Coordina la validación y envío
- Maneja la lógica de creación de la liga
- Controla la navegación tras la creación exitosa
- Orquesta la interacción entre componentes

### 2. LeagueFormHeader

Muestra:
- Título del formulario con icono
- Separador visual

### 3. NameSection

Maneja:
- Campo para ingresar el nombre de la liga
- Validación y feedback visual

### 4. TypeSection

Proporciona:
- Selector para el tipo de liga
- Campo condicional para el país
- Textos de ayuda específicos según el tipo

### 5. SettingsSection

Permite configurar:
- Número máximo de equipos permitidos
- Número de jornadas
- Límites adaptativos según el tipo de liga

### 6. ManagerSection

Muestra:
- Información del manager actual
- Campo no editable con datos del creador

### 7. StatusMessages

Muestra:
- Mensajes de éxito tras crear la liga
- Mensajes de error con detalles expandibles
- Feedback visual para el usuario

### 8. FormActions

Proporciona:
- Botón para la creación de la liga
- Indicador de carga durante el proceso
- Texto informativo sobre los siguientes pasos

## Utilidades

### 1. leagueCreation.js

Contiene:
- `createLeague`: Función para crear una nueva liga vía API
- `formatLeagueData`: Función para formatear los datos del formulario

### 2. leagueFormValidators.js

Proporciona:
- `validateLeagueForm`: Validación completa del formulario
- Funciones específicas para validar campos individuales
- Reglas de validación según el tipo de liga

## Flujo de Datos

1. El usuario completa los campos del formulario
2. Al enviar, se validan todos los campos
3. Si son válidos, se formatean y envían a la API
4. Se muestra feedback de éxito o error
5. En caso de éxito, se redirige a la página de la liga creada

## Beneficios de la Refactorización

1. **Mejor Separación de Responsabilidades**: Cada componente tiene una función clara
2. **Mantenibilidad Mejorada**: Componentes más pequeños y enfocados
3. **Reutilización**: Componentes que pueden usarse en otros formularios
4. **Legibilidad**: Estructura clara y organizada
5. **Testabilidad**: Más fácil escribir pruebas para cada componente

## Uso

```jsx
import LeagueInput from './components/league/input';

function CreateLeaguePage() {
  const handleLeagueCreated = (leagueId) => {
    console.log(`Liga creada con ID: ${leagueId}`);
  };

  return (
    <div>
      <h1>Crear Liga</h1>
      <LeagueInput onCreateLeague={handleLeagueCreated} />
    </div>
  );
}
```

## Sugerencias para Futuras Mejoras

1. **Formulario controlado por esquema**: Usar una biblioteca como Formik o React Hook Form
2. **Validación avanzada**: Implementar Yup o Zod para validación basada en esquemas
3. **Internacionalización**: Preparar los textos para soporte multi-idioma
4. **Pasos guiados**: Convertir a un formulario multi-paso para ligas complejas
5. **Estados persistentes**: Guardar el estado del formulario localmente para recuperación