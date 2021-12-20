#!/bin/sh

BACKUP_FOLDER=/var/lib/mysql
NOW=$(date '+%d')

GZIP=$(which gzip)
MYSQLDUMP=$(which mysqldump)

### MySQL Server Login info ###
MDB=awsomecoder
MPASS=PNYpny29@12345
MUSER=root

FILE=${BACKUP_FOLDER}/backup-${NOW}.sql.gz
$MYSQLDUMP -u $MUSER -p${MPASS} --databases $MDB | $GZIP -9 > $FILE
