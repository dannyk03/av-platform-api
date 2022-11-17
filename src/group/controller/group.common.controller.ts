import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { User } from '@/user/entity';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { GroupCreateDto } from '../dto';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GroupCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
  ) {}

  @ClientResponse('group.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateGroup, {
    tags: ['group', 'create'],
  })
  @AclGuard()
  @Post()
  async create(
    @ReqAuthUser()
    reqUser: User,
    @Body()
    { name, description }: GroupCreateDto,
  ): Promise<void> {
    return;
  }
}
