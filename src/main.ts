import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

!async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Define the CORS options
    const corsOptions= {
        origin: [
            'http://grymachtest.ddns.net',
            'https://www.google.com',
            'http://91.214.247.147',
            'http://127.0.0.1:3008',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Enable cookies and authentication headers
    };

    // Enable CORS with the defined options
    app.enableCors(corsOptions);

    await app.listen(process.env.PORT || 3008);
}();
