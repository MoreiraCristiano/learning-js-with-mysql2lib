# Run containers

- MySQL: docker run -d -p 3306:33060 -v /var/lib/docker/volumes/mysql-users-api/\_data:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root **ID**

- myApi: docker container run -d -p 8081:8081 **ID**
