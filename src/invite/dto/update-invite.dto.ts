import { PartialType } from '@nestjs/mapped-types';
import { CreateOrDelInviteDto } from './create-or-del-invite.dto';
import {IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, Min} from "class-validator";
import {Transform} from "class-transformer";

export class AcceptInviteDto extends PartialType(CreateOrDelInviteDto) {

    @Transform(({value}) => isNaN(parseInt(value)) ? 0 : parseInt(value),)
    @IsNotEmpty()
    @IsNumber({},{message: 'Invite id for should be number'})
    @Min(1)
    readonly inviteId: number;

    @Transform(({ value }) => value.toString() === 'true')
    @IsNotEmpty()
    @IsBoolean({message: 'id company for delete should be number'})
    readonly accept: boolean;
}
