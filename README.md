# Tasks Back End 6.0
## Description:
First of all we created Get route with simple response.
You can check on this endpoint- http://localhost:3008/.
Tou need create .env file and add into it contein with vars as in sample file.
Start the application.
```
yarn install

nest start --watch
```
If you would like start this app in Docker make next steps:
```
docker build -t health-check-img . 

docker run -p 3000:3008 --name healthCheckContainer --rm health-check-img
 
```
For stops application execute next command(application will be stoped and container will be removed) 
```
docker stop healthCheckContainer
```

For run application in Docker Compose with database execute next command:
```
docker compose up
```
For migration i added dotenv packedje to  typeorm.config.ts
For create empty migration for handler contains execute next command:
```
typeorm migration:create ./src/migrations/init
```
Run this command you can see a new file generated in the "migrations" directory named {TIMESTAMP}-monday.ts and
we can run it, and it will create a new table in our database.
```
npm run migration:generate -- src/migrations/monday

yarn run migration:run

yarn run migration:revert

```