import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReqestsService } from './reqests.service';
import { CreateReqestDto } from './dto/create-reqest.dto';
import { UpdateReqestDto } from './dto/update-reqest.dto';

@Controller('reqests')
export class ReqestsController {
  constructor(private readonly reqestsService: ReqestsService) {}

  @Post()
  create(@Body() createReqestDto: CreateReqestDto) {
    return this.reqestsService.create(createReqestDto);
  }

  @Get()
  findAll() {
    return this.reqestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reqestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReqestDto: UpdateReqestDto) {
    return this.reqestsService.update(+id, updateReqestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reqestsService.remove(+id);
  }
}
