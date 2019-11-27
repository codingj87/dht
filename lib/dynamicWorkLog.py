# -*- coding: utf-8 -*-
from django.db import models, connection
from control.models import User

__readSet = {}
PREFIX = "WORKLOG_"
DBSEP = '"'


def _createTable(date):
    sqls = [
        """CREATE TABLE IF NOT EXISTS {sep}{table_prefix}{date}{sep} (
            {sep}id{sep} serial NOT NULL PRIMARY KEY,
            {sep}userid{sep} varchar(32) NOT NULL,
            {sep}username{sep} varchar(32),
            {sep}is_admin{sep} INTEGER DEFAULT 0,
            {sep}user_ip{sep} varchar(15),
            {sep}action{sep} varchar(64) NOT NULL,
            {sep}response{sep} varchar(255),
            {sep}ticket_id{sep} bigint,
            {sep}desc{sep} text,
            {sep}result{sep} text,
            {sep}ctime{sep} integer NOT NULL)""".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}userid{sep} ON {sep}{table_prefix}{date}{sep} ({sep}userid{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}userid_like{sep} ON {sep}{table_prefix}{date}{sep} ({sep}userid{sep} varchar_pattern_ops)".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}user_ip{sep} ON {sep}{table_prefix}{date}{sep} ({sep}user_ip{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}user_ip_like{sep} ON {sep}{table_prefix}{date}{sep} ({sep}user_ip{sep} varchar_pattern_ops)".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}action{sep} ON {sep}{table_prefix}{date}{sep} ({sep}action{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}action_like{sep} ON {sep}{table_prefix}{date}{sep} ({sep}action{sep} varchar_pattern_ops)".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}response{sep} ON {sep}{table_prefix}{date}{sep} ({sep}response{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}response_like{sep} ON {sep}{table_prefix}{date}{sep} ({sep}response{sep} varchar_pattern_ops)".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}ctime{sep} ON {sep}{table_prefix}{date}{sep} ({sep}ctime{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date),
        "CREATE INDEX IF NOT EXISTS {sep}{table_prefix}{date}ticket_id{sep} ON {sep}{table_prefix}{date}{sep} ({sep}ticket_id{sep})".format(sep=DBSEP, table_prefix=PREFIX, date=date)
    ]

    with connection.cursor() as cursor:
        for sql in sqls:
            try: cursor.execute(sql)
            except: pass


def _getLogModel(date):
    _app_label = 'dht'
    _db_table = "%s%s" % (PREFIX, date)
    _model_name = "WorkLog%s" % date

    class Meta:
        app_label = _app_label
        db_table = _db_table
        managed = False

    def save(self, *args, **kwargs):
        try:
            user = User.objects.get(userid=self.userid)
            self.username = user.name
            self.is_admin = user.is_admin
            super(modelClass, self).save(*args, **kwargs)
        except:
            pass

    attrs = {
        "__module__": 'control.models',
        "Meta": Meta,
        "id": models.AutoField(primary_key=True),
        "userid": models.CharField(max_length=32, db_index=True),
        "username": models.CharField(max_length=32, db_index=True),
        "is_admin": models.IntegerField(default=0),# 관리자여부(0: 일반, 1: 최고관리자, 2: 그룹관리자)
        "user_ip": models.CharField(max_length=15, null=True, db_index=True),
        "action": models.CharField(max_length=64, db_index=True),
        "response": models.CharField(max_length=255, null=True, db_index=True),
        "ticket_id": models.BigIntegerField(null=True, db_index=True),
        "ctime": models.IntegerField(db_index=True),
        "desc": models.TextField(null=True),
        "result": models.TextField(null=True),
        "save": save
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
