import {DataSource} from "typeorm"
import {config} from 'dotenv'
import {ConfigService} from "@nestjs/config";

config()
const configService = new ConfigService();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_DOCKER_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_ROOT_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
        __dirname + '/**/*.entity{.js,.ts}',
    ],
    migrations: ["src/migrations/*.ts"],
    /*logging: "all",*/
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
export default AppDataSource;
/*host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_DOCKER_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password:  configService.get<string>('POSTGRES_ROOT_PASSWORD'),
    database:  configService.get<string>('POSTGRES_DATABASE'),*/