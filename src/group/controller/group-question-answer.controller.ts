import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { Group, GroupQuestion } from '@/group/entity';
import { User } from '@/user/entity';

import { GroupQuestionAnswerService } from '@/group/service';

import {
  CanAccessGroupQuestion,
  ReqGroup,
  ReqGroupQuestion,
} from '@/group/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import {
  GroupQuestionAnswerCreateDto,
  GroupQuestionAnswerListDto,
  GroupQuestionAnswerUpdateDto,
} from '@/group/dto';
import { IdParamDto } from '@/utils/request/dto';

import { GroupQuestionAnswerGetSerialization } from '@/group/serialization/group-question-answer/get.serialization';

@Controller({
  version: '1',
})
export class GroupQuestionAnswerController {
  constructor(
    private readonly groupQuestionAnswerService: GroupQuestionAnswerService,
  ) {}

  @ClientResponsePaging('group.question.answer.list', {
    classSerialization: GroupQuestionAnswerGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: false })
  @AclGuard()
  @Get()
  async list(
    @ReqAuthUser()
    user: User,
    @Query()
    dto: GroupQuestionAnswerListDto,
    @ReqGroup()
    group: Group,
    @ReqGroupQuestion()
    groupQuestion: GroupQuestion,
  ) {
    return this.groupQuestionAnswerService.getGroupPaginatedList({
      groupQuestion,
      group,
      dto,
      user,
    });
  }

  @ClientResponse('group.question.answer.create', {
    classSerialization: GroupQuestionAnswerGetSerialization,
  })
  // @LogTrace(EnumLogAction.CreateGroupQuestionAnswer, {
  //   tags: ['group', 'question', 'answer', 'create'],
  // })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: false })
  @AclGuard()
  @Post()
  createAnswer(
    @ReqAuthUser()
    user: User,
    @Body()
    dto: GroupQuestionAnswerCreateDto,
    @ReqGroupQuestion()
    groupQuestion: GroupQuestion,
  ): Promise<IResponseData> {
    return this.groupQuestionAnswerService.createAnswer({
      user,
      dto,
      groupQuestion,
    });
  }

  @ClientResponse('group.question.answer.update', {
    classSerialization: GroupQuestionAnswerGetSerialization,
  })
  // @LogTrace(EnumLogAction.CreateGroupQuestionAnswer, {
  //   tags: ['group', 'question', 'answer', 'create'],
  // })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: false })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Patch('/:id')
  updateAnswer(
    @ReqAuthUser()
    user: User,
    @Body()
    dto: GroupQuestionAnswerUpdateDto,
    @Param('id')
    id: string,
  ): Promise<IResponseData> {
    return this.groupQuestionAnswerService.updateAnswer({
      user,
      dto,
      id,
    });
  }

  @ClientResponse('group.question.answer.remove', {
    classSerialization: GroupQuestionAnswerGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: false })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Delete('/:id')
  removeAnswer(
    @ReqAuthUser()
    user: User,
    @Param('id')
    id: string,
  ) {
    return this.groupQuestionAnswerService.removeAnswer({
      user,
      id,
    });
  }
}
