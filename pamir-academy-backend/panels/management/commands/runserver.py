import os
import sys
from pathlib import Path

from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import (
    Command as StaticfilesRunserverCommand,
)
from django.core.management import call_command
from django.db import connections


def _should_sqlite_create_drop() -> bool:
    """Only in the autoreloader worker, or single-process ``--noreload`` (avoids Win file lock)."""
    if "--noreload" in sys.argv:
        return True
    return os.environ.get("RUN_MAIN") == "true"


class Command(StaticfilesRunserverCommand):
    """Extends runserver: optional SQLite create-drop before the server starts."""

    def handle(self, *args, **options):
        if (
            getattr(settings, "DB_CREATE_DROP", False)
            and settings.DEBUG
            and settings.DATABASES["default"]["ENGINE"] == "django.db.backends.sqlite3"
            and _should_sqlite_create_drop()
        ):
            path = Path(settings.DATABASES["default"]["NAME"])
            connections.close_all()
            for suffix in ("", "-wal", "-shm"):
                p = path if not suffix else Path(str(path) + suffix)
                if p.exists():
                    p.unlink()
            self.stdout.write("DB_CREATE_DROP: recreated SQLite database, running migrations...")
            call_command("migrate", "--noinput", verbosity=1)
        super().handle(*args, **options)
