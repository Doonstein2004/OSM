from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Importar modelos para crear tablas
from .database import engine
from .schemas.base import Base

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

# Incluir routers
app.include_router(teams.router)
app.include_router(leagues.router)
app.include_router(matches.router)
app.include_router(calendar.router)
app.include_router(templates.router)
app.include_router(analytics.router)

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