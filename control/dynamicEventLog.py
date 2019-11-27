# -*- coding: utf-8 -*-
from django.db import models, connection


__readSet = {}
PREFIX = "EVENTLOG_"


def _createTable(date):
    sqls = [
        """CREATE TABLE IF NOT EXISTS "{table_prefix}{date}" (
            "id" serial NOT NULL PRIMARY KEY,
            "svr_ip" varchar(15) NOT NULL,
            "ctime" integer NOT NULL,
            "severity_level" integer NOT NULL,
            "msg" TEXT)""".format(
            table_prefix=PREFIX, date=date
        ),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}ctime" ON "{table_prefix}{date}" ("ctime")'.format(
            table_prefix=PREFIX, date=date
        ),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}svr_ip" ON "{table_prefix}{date}" ("svr_ip")'.format(
            table_prefix=PREFIX, date=date
        ),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}svr_ip_like" ON "{table_prefix}{date}" ("svr_ip" varchar_pattern_ops)'.format(
            table_prefix=PREFIX, date=date
        ),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}severity_level" ON "{table_prefix}{date}" ("severity_level")'.format(
            table_prefix=PREFIX, date=date
        ),
    ]

    with connection.cursor() as cursor:
        for sql in sqls:
            try:
                cursor.execute(sql)
            except:
                pass


def _getLogModel(date):
    _app_label = "dht"
    _db_table = "%s%s" % (PREFIX, date)
    _model_name = "EventLog%s" % date

    class Meta:
        app_label = _app_label
        db_table = _db_table
        managed = False

    attrs = {
        "__module__": "control.models",
        "Meta": Meta,
        "id": models.AutoField(primary_key=True),
        "ctime": models.IntegerField(db_index=True),
        "svr_ip": models.CharField(max_length=32, db_index=True),
        "severity_level": models.IntegerField(db_index=True),
        "msg": models.TextField(),
    }

    modelClass = type(_model_name, (models.Model,), attrs)

    if (
        connection.introspection.identifier_converter(_db_table)
        not in connection.introspection.table_names()
    ):
        _createTable(date)

    return modelClass


def getLogModel(date):
    if date in __readSet:
        return __readSet[date]
    else:
        modelClass = _getLogModel(date)
        __readSet[date] = modelClass
        return modelClass


def getLogTables():
    return [
        tableName[len(PREFIX) :]
        for tableName in connection.introspection.table_names()
        if tableName.startswith(PREFIX)
    ]


# EOF
