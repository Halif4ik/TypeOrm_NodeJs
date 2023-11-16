import { PartialType } from '@nestjs/mapped-types';
import { CreateInviteDto } from './create-invite.dto';

export class UpdateInviteDto extends PartialType(CreateInviteDto) {}
