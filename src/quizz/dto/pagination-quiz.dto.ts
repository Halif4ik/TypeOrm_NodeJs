import {PaginationsDto} from "../../user/dto/pagination-user.dto";
import {IntersectionType} from "@nestjs/mapped-types";
import {AdditionalUpdateQuizCompanyId} from "./update-quizz.dto";

export class PaginationsQuizDto extends IntersectionType(PaginationsDto, AdditionalUpdateQuizCompanyId
) {
}
