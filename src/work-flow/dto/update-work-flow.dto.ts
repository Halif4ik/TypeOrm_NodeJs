import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkFlowDto } from './create-work-flow.dto';

export class UpdateWorkFlowDto extends PartialType(CreateWorkFlowDto) {}
