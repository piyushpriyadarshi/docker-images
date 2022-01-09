#docker exec -i docker-images_mysql_1 bash -c mysql_back
NOW=$(date '+%d-%m-%y')
FILE=backup-${NOW}.sql.gz
docker exec awsomecoder_db1 /usr/bin/mysqldump -u root --password=$1 awsomecoder | /bin/gzip -9 > $FILE
