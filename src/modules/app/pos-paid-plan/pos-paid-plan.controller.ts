import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { CreatePosPaidPlanDto } from './create-pos-paid-plan.dto';
import { LinkPosPaidPlanDto } from './link-pos-paid-plan.dto';
import { PlanQuery } from './plan.query';
import { PosPaidPlanService } from './pos-paid-plan.service';
import { UpdatePosPaidPlanDto } from './update-pos-paid-plan.dto';

@Controller('pos-paid-plan')
export class PosPaidPlanController {
  constructor(private readonly posPaidPlanService: PosPaidPlanService) {}

  @Post()
  create(@Body() data: CreatePosPaidPlanDto) {
    return this.posPaidPlanService.create(data);
  }

  @Post('/link-to-customers')
  linkedToCustomer(@Body() data: LinkPosPaidPlanDto) {
    return this.posPaidPlanService.linkToCustomer(data);
  }

  @Post('/connect-to-customer')
  connect(
    @Request() req,
    @Body() data: Pick<LinkPosPaidPlanDto, 'posPaidPlanId'>,
  ) {
    return this.posPaidPlanService.connectToCustomer(
      req.user.id,
      data.posPaidPlanId,
    );
  }

  @Delete('/disconnect-to-customer')
  disconnect(@Request() req) {
    return this.posPaidPlanService.disconnectToCustomer(req.user.id);
  }

  @Get()
  findAll(@Query() query: PlanQuery) {
    return this.posPaidPlanService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posPaidPlanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePosPaidPlanDto) {
    return this.posPaidPlanService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posPaidPlanService.remove(id);
  }
}
