import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { IResponseData, IResponsePagingData } from '@avo/type';

import { Group, GroupQuestion } from '@/group/entity';
import { User } from '@/user/entity';

import { GroupQuestionService } from '@/group/service';

import { CanAccessGroupAsGroupMember, ReqGroup } from '@/group/decorator';
import { ReqGroupQuestion } from '@/group/decorator/group-question-request.decorator';
import { CanAccessGroupQuestion } from '@/group/decorator/group-question.decorator';
import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import {
  GroupQuestionCreateDto,
  GroupQuestionListDto,
  GroupQuestionUpdateDto,
} from '@/group/dto';

import {
  GroupQuestionGetSerialization,
  GroupQuestionWithPreviewGetSerialization,
} from '@/group/serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GroupQuestionController {
  constructor(private readonly groupQuestionService: GroupQuestionService) {}

  @ClientResponsePaging('group.question.list', {
    classSerialization: GroupQuestionWithPreviewGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
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
    return this.groupQuestionService.getGroupQuestionPaginatedList(
      user,
      dto,
      group,
    );
  }

  @ClientResponse('group.question.create', {
    classSerialization: GroupQuestionGetSerialization,
  })
  @LogTrace(EnumLogAction.CreateGroupQuestion, {
    tags: ['group', 'question', 'create'],
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard({
    relations: ['profile'],
  })
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

  @ClientResponse('group.question.update', {
    classSerialization: GroupQuestionGetSerialization,
  })
  @LogTrace(EnumLogAction.UpdateGroupQuestion, {
    tags: ['group', 'question', 'update'],
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: true })
  @AclGuard()
  @Patch('/:id')
  updateQuestion(
    @Body()
    { data }: GroupQuestionUpdateDto,
    @ReqGroupQuestion()
    groupQuestion: GroupQuestion,
  ): Promise<IResponseData> {
    return this.groupQuestionService.save({
      ...groupQuestion,
      data,
    });
  }

  @ClientResponse('group.question.remove', {
    classSerialization: GroupQuestionGetSerialization,
  })
  @LogTrace(EnumLogAction.UpdateGroupQuestion, {
    tags: ['group', 'question', 'remove'],
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupQuestion({ owner: true })
  @AclGuard()
  @Delete('/:id')
  deleteQuestion(
    @ReqGroupQuestion()
    groupQuestion: GroupQuestion,
  ): Promise<IResponseData> {
    return this.groupQuestionService.remove(groupQuestion);
  }
}
