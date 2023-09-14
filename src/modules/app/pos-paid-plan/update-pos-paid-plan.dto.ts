import { PartialType } from '@nestjs/mapped-types';
import { CreatePosPaidPlanDto } from './create-pos-paid-plan.dto';

export class UpdatePosPaidPlanDto extends PartialType(CreatePosPaidPlanDto) {}
