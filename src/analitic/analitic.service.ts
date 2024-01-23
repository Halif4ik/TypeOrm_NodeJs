import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateAnaliticDto} from './dto/create-analitic.dto';
import {UpdateAnaliticDto} from './dto/update-analitic.dto';
import {User} from "../user/entities/user.entity";
import {GeneralRating} from "../work-flow/entities/generalRating.entity";
import {QuizService} from "../quizz/quizService";
import {InjectRepository} from "@nestjs/typeorm";
import {PassedQuiz} from "../work-flow/entities/passedQuiz.entity";
import {Repository} from "typeorm";
import {AvgRating} from "../work-flow/entities/averageRating.entity";
import {RedisService} from "@songkeys/nestjs-redis";
import {ConfigService} from "@nestjs/config";
import {GeneralResponse} from "../GeneralResponse/interface/generalResponse.interface";
import {TGeneralRating} from "../GeneralResponse/interface/customResponces";

@Injectable()
export class AnaliticService {
    private readonly logger: Logger = new Logger(AnaliticService.name);

    constructor(private quizService: QuizService,
                @InjectRepository(GeneralRating) private generalRatingRepository: Repository<GeneralRating>,
                private readonly configService: ConfigService,
    ) {
    }

    async getMyGeneralRating(userFromGuard: User): Promise<GeneralResponse<TGeneralRating>> {
        const generalRating: GeneralRating | null = await this.generalRatingRepository.findOne({
            where: {
                user: {id: userFromGuard.id},
            },
            relations: ['user']
        });
        if (!generalRating) throw new HttpException("General rating didnt create", HttpStatus.NOT_FOUND)
        return {
            "status_code": HttpStatus.OK,
            "detail": {
                "general-rating": generalRating,
            },
            "result": "found"
        };

    }
}
