#docker exec -i docker-images_mysql_1 bash -c mysql_back

docker exec docker-images_mysql_1 /usr/bin/mysqldump -u root --password=$1 awsomecoder > backup.sql

