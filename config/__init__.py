# Carga Celery al iniciar Django para que las tareas se registren correctamente
from .celery import app as celery_app  # noqa: F401

__all__ = ('celery_app',)
