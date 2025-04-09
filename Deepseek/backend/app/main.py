from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Importar modelos para crear tablas
from .database import engine, Base

# Importar routers
from .routers import teams, leagues, matches, calendar, templates, analytics

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Crear la aplicación
app = FastAPI(
    title="Simulador de Torneo de Fútbol",
    description="API para simular y gestionar un torneo de fútbol con estadísticas avanzadas",
    version="0.2.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importar los routers directamente (evita importación circular)
from .routers.teams import router as teams_router
from .routers.leagues import router as leagues_router
from .routers.matches import router as matches_router
from .routers.calendar import router as calendar_router
from .routers.templates import router as templates_router
from .routers.analytics import router as analytics_router

# Incluir routers (usando los nombres correctos)
app.include_router(teams_router)
app.include_router(leagues_router)
app.include_router(matches_router)
app.include_router(calendar_router)
app.include_router(templates_router)
app.include_router(analytics_router)

@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API del Simulador de Torneo de Fútbol",
        "docs": "/docs",
        "version": "0.2.0"
    }

# Punto de entrada para ejecución directa
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)