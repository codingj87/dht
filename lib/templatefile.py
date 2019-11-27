# -*- coding: utf-8 -*-
import os, uuid, time

from zen.common import environment, config as conf
conf.load(os.path.join(environment.ETC_DIRECTORY, "ipms", "zen.conf"))
TEMPLATE_DIR = conf.get("common", "AttachFileDirectory", "/opt/zen/var/dht-data/attach")


def create_file(mode, fileName=None, fileType=None, encoding=None):
    fileDirectory = os.path.join(TEMPLATE_DIR, time.strftime('%Y%m%d'))
    randomName = str(uuid.uuid1()).split('-', 1)[0]  # random
    if fileName:
        if fileType:
            baseDirectory = f"{randomName}.{fileType}"

            fileDirectory = os.path.join(fileDirectory, baseDirectory)
            if not os.path.exists(fileDirectory):
                try: os.makedirs(fileDirectory)
                except: pass

            filePath = os.path.join(fileDirectory, f"{randomName}.{fileType}")
        else:
            fileDirectory = os.path.join(fileDirectory, randomName)
            if not os.path.exists(fileDirectory):
                try: os.makedirs(fileDirectory)
                except: pass

            filePath = os.path.join(fileDirectory, randomName)
    else:
        if not os.path.exists(fileDirectory):
            try: os.makedirs(fileDirectory)
            except: pass

        if fileType:
            filePath = os.path.join(fileDirectory, f"{randomName}.{fileType}")
        else:
            filePath = os.path.join(fileDirectory, randomName)

    with open(filePath, mode, encoding=encoding):
        pass

    return filePath

def create_string(fileName=None, fileType=None, encoding='cp949'):
    return create_file('w', fileName, fileType, encoding)

def create_byte(fileName=None, fileType=None):
    return create_file('wb', fileName, fileType)

def create_path(fileType=None):
    fileDirectory = os.path.join(TEMPLATE_DIR, time.strftime('%Y%m%d'))
    if not os.path.exists(fileDirectory):
        try: os.makedirs(fileDirectory)
        except: pass
    randomName = str(uuid.uuid1()).split('-', 1)[0]  # random
    fileName = f"{randomName}.{fileType}" if fileType else randomName
    return os.path.join(fileDirectory, fileName)

# EOF
