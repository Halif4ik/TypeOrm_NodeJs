import {TestikController} from "./testik/testik.controller";
import {Module} from "@nestjs/common";
import {TestikService} from "./testik/testik.service";

@Module({
  controllers: [TestikController],
  providers: [TestikService],
})
export class AppModule {}