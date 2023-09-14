import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
import { MessagesQuery } from './messages.query';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/send')
  async create(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    return await this.messagesService.sendMessage(
      createMessageDto,
      req.user.id,
    );
  }

  @Get()
  findAll(@Req() req, @Query() query: MessagesQuery) {
    return this.messagesService.findAll(req.user.id, query);
  }
}
