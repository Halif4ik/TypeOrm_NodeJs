import {Module} from '@nestjs/common';
import {TestikService} from './testik.service';
import {TestikController} from './testik.controller';

@Module({
    controllers: [TestikController],
    providers: [TestikService],
})
export class TestikModule {
}
