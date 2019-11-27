# -*- coding: utf-8 -*-
import logging

from django.db import models, connection

__readSet = {}
PREFIX = "EVENTLOG_"
DBSEP = '"'


def _create_table(date):
    sqls = [
        """CREATE TABLE IF NOT EXISTS {sep}{table_prefix}{date}{sep} (
            {sep}id{sep} serial NOT NULL PRIMARY KEY,
            {sep}svr_ip{sep} varchar(15) NOT NULL,
            {sep}ctime{sep} integer NOT NULL,
            {sep}severity_level{sep} integer NOT NULL,
            {sep}msg{sep} text)""".format(
            sep=DBSEP, table_prefix=PREFIX, date=date
        ),
        "CREATE INDEX IF NOT EXISTS "
        "{sep}{table_prefix}{date}svr_ip{sep} ON "
        "{sep}{table_prefix}{date}{sep} "
        "({sep}svr_ip{sep} varchar_pattern_ops)".format(
            sep=DBSEP, table_prefix=PREFIX, date=date
        ),
        "CREATE INDEX IF NOT EXISTS "
        "{sep}{table_prefix}{date}ctime{sep} ON "
        "{sep}{table_prefix}{date}{sep} "
        "({sep}ctime{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS "
        "{sep}{table_prefix}{date}severity_level{sep} ON "
        "{sep}{table_prefix}{date}{sep} ({sep}severity_level{sep})".format(
            sep=DBSEP, table_prefix=PREFIX, date=date
        ),
        "CREATE INDEX IF NOT EXISTS "
        "{sep}{table_prefix}{date}msg{sep} ON "
        "{sep}{table_prefix}{date}{sep} "
        "({sep}msg{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date)
    ]

    with connection.cursor() as cursor:
        for sql in sqls:
            try:
                cursor.execute(sql)
            except Exception as e:
                logging.error(str(e))


def _get_log_model(date):
    _app_label = 'control'
    _db_table = "%s%s" % (PREFIX, date)
    _model_name = "EventLog%s" % date

    class Meta:
        app_label = _app_label
        db_table = _db_table
        managed = False

    attrs = {
        "__module__": 'control.models',
        "Meta": Meta,
        "id": models.AutoField(primary_key=True),
        "svr_ip": models.CharField(max_length=15, db_index=True),
        "ctime": models.IntegerField(db_index=True),
        "severity_level": models.IntegerField(db_index=True),
        "msg": models.TextField(null=True)
    }

    model_class = type(_model_name, (models.Model, ), attrs)
    if connection.introspection.identifier_converter(_db_table) not in connection.introspection.table_names():
        _create_table(date)

    return model_class


def get_log_model(date):
    if date in __readSet:
        return __readSet[date]
    else:
        model_class = _get_log_model(date)
        __readSet[date] = model_class
        return model_class


def get_log_tables():
    return [
        tableName[len(PREFIX):]
        for tableName in connection.introspection.table_names()
        if tableName.startswith(PREFIX)
    ]

# EOF
