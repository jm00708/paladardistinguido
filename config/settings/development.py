from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# En desarrollo se puede usar caché local
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

CORS_ALLOW_ALL_ORIGINS = True
