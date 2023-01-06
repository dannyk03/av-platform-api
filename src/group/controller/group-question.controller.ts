import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { IResponsePagingData } from '@avo/type';

import { User } from '@/user/entity';

import { GroupQuestionService } from '@/group/service';

import { CanAccessAsGroupMember } from '@/group/decorator';
import { ReqAuthUser } from '@/user/decorator';
import { ClientResponsePaging } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { GroupQuestionListDto } from '@/group/dto';

import { GroupQuestionGetSerialization } from '@/group/serialization';

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
    @Param('groupId')
    groupId: string,
  ): Promise<IResponsePagingData> {
    return this.groupQuestionService.getGroupPaginatedList(user, dto, groupId);
  }
}
