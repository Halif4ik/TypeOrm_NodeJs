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
    database: configService.get<string>('POSTGRES_DATABASE'),
    entities: [
        __dirname + '/**/*.entity{.js,.ts}',
    ],
    migrations: ["src/migrations/*.ts"],
    logging: true,
    logger: "advanced-console",
    /*ssl: { rejectUnauthorized: false },*/
})

AppDataSource.initialize()
    .then(() => {
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
export default AppDataSource;
/*host: configService.get<string>('POSTGRES_HOST'),
    database:  ,*/