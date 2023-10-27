import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_DOCKER_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_ROOT_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
        __dirname + '/**/*.entity{.ts}',
    ],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
export default AppDataSource;