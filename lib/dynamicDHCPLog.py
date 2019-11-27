# -*- coding: utf-8 -*-
from django.db import models, connection


__readSet = {}
PREFIX = "DHCPLOG_"


def _createTable(date):
    sqls = [
        """CREATE TABLE IF NOT EXISTS "{table_prefix}{date}" (
            "id" serial NOT NULL PRIMARY KEY,
            "svr_ip" varchar(15) NOT NULL,
            "ctime" integer NOT NULL,
            "type" varchar(15) NOT NULL,
            "ciaddr" varchar(15) NOT NULL,
            "chaddr" varchar(12) NOT NULL,
            "yiaddr" varchar(15) NOT NULL,
            "giaddr" varchar(15) NOT NULL,
            "rqaddr" varchar(15),
            "class" varchar(15),
            "vendorclass" varchar(15),
            "hostname" varchar(15))""".format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}ctime" ON "{table_prefix}{date}" ("ctime")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}svr_ip" ON "{table_prefix}{date}" ("svr_ip")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}svr_ip_like" ON "{table_prefix}{date}" ("svr_ip" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}ciaddr" ON "{table_prefix}{date}" ("ciaddr")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}ciaddr_like" ON "{table_prefix}{date}" ("ciaddr" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}chaddr" ON "{table_prefix}{date}" ("chaddr")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}chaddr_like" ON "{table_prefix}{date}" ("chaddr" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}yiaddr" ON "{table_prefix}{date}" ("yiaddr")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}yiaddr_like" ON "{table_prefix}{date}" ("yiaddr" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}giaddr" ON "{table_prefix}{date}" ("giaddr")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}giaddr_like" ON "{table_prefix}{date}" ("giaddr" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}hostname" ON "{table_prefix}{date}" ("hostname")'.format(table_prefix=PREFIX, date=date),
        'CREATE INDEX IF NOT EXISTS "{table_prefix}{date}hostname_like" ON "{table_prefix}{date}" ("hostname" varchar_pattern_ops)'.format(table_prefix=PREFIX, date=date)
    ]

    with connection.cursor() as cursor:
        for sql in sqls:
            try:
                cursor.execute(sql)
            except:
                pass


def _getLogModel(date):
    _app_label = 'dht'
    _db_table = "%s%s" % (PREFIX, date)
    _model_name = "DHCPLog%s" % date

    class Meta:
        app_label = _app_label
        db_table = _db_table
        managed = False

    attrs = {
        "__module__": 'control.models',
        "Meta": Meta,
        "id": models.AutoField(primary_key=True),
        "ctime": models.IntegerField(db_index=True),
        "svr_ip": models.CharField(max_length=32, db_index=True),
        "type": models.CharField(max_length=15),  # Ack, Request, LeaseQuery, ...
        "ciaddr": models.CharField(max_length=15, db_index=True),
        "chaddr": models.CharField(max_length=12, db_index=True),
        "yiaddr": models.CharField(max_length=15, db_index=True),
        "giaddr": models.CharField(max_length=15, db_index=True),
        "rqaddr": models.CharField(max_length=15, null=True),
        "class": models.CharField(max_length=15, null=True),
        "vendorclass": models.CharField(max_length=15, null=True),
        "hostname": models.CharField(max_length=15, null=True)
    }

    modelClass = type(_model_name, (models.Model, ), attrs)

    if connection.introspection.identifier_converter(_db_table) not in connection.introspection.table_names():
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
        tableName[len(PREFIX):]
        for tableName in connection.introspection.table_names()
        if tableName.startswith(PREFIX)
    ]

# EOF
