import { PartialType } from '@nestjs/mapped-types';
import { CreateOrDelInviteDto } from './create-or-del-invite.dto';

export class UpdateInviteDto extends PartialType(CreateOrDelInviteDto) {}
