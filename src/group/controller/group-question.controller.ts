import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { IResponseData, IResponsePagingData } from '@avo/type';

import { Group } from '@/group/entity';
import { User } from '@/user/entity';

import { GroupQuestionService } from '@/group/service';

import { CanAccessAsGroupMember, ReqGroup } from '@/group/decorator';
import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { GroupQuestionListDto } from '@/group/dto';
import { GroupQuestionCreateDto } from '@/group/dto/group-question.create.dto';

import { GroupQuestionGetSerialization } from '@/group/serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GroupQuestionController {
  constructor(private readonly groupQuestionService: GroupQuestionService) {}

  @ClientResponsePaging('group.question.list', {
    classSerialization: GroupQuestionGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessAsGroupMember()
  @AclGuard()
  @Get()
  list(
    @ReqAuthUser()
    user: User,
    @Query()
    dto: GroupQuestionListDto,
    @ReqGroup()
    group: Group,
  ): Promise<IResponsePagingData> {
    return this.groupQuestionService.getGroupPaginatedList(user, dto, group);
  }

  @ClientResponse('group.question.create', {
    classSerialization: GroupQuestionGetSerialization,
  })
  @LogTrace(EnumLogAction.CreateGroupQuestion, {
    tags: ['group', 'question', 'create'],
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessAsGroupMember()
  @AclGuard()
  @Post()
  createQuestion(
    @ReqAuthUser()
    user: User,
    @ReqGroup()
    group: Group,
    @Body()
    dto: GroupQuestionCreateDto,
  ): Promise<IResponseData> {
    return this.groupQuestionService.createGroupQuestion(user, dto, group);
  }
}
