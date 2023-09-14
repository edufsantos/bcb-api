import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { CustomersService } from './custumers.service';
import { CustomerQuery } from './customer.query';
import { UpdateCustomerDto } from './update-custumers.dto';

@Controller('customer')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  findAll(@Query() query: CustomerQuery) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCustomerDto) {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
