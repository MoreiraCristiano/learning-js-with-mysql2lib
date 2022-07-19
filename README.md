# Run containers

- MySQL: docker run -d -p 3306:33060 -v /var/lib/docker/volumes/mysql-users-api/\_data:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root **ID**

- myApi: docker container run -d -p 8081:8081 **ID**

- docker-compose up

Tentar fazer query sql no start do banco:

- create database js_sql;
- use database js_sql;
- create table users(ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, passwd VARCHAR(255) NOT NULL);
