import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { EnumGroupQuestionAnswerStatusCodeError } from '@avo/type';

import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Group, GroupQuestion, GroupQuestionAnswer } from '@/group/entity';
import { User } from '@/user/entity';

import { GroupQuestionService, GroupService } from '@/group/service';
import { PaginationService } from '@/utils/pagination/service';

import { IGroupQuestionAnswerSearch } from '@/group/type';

import {
  GroupQuestionAnswerCreateDto,
  GroupQuestionAnswerListDto,
  GroupQuestionAnswerUpdateDto,
} from '@/group/dto';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupQuestionAnswerService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupQuestionAnswer, ConnectionNames.Default)
    private readonly groupQuestionAnswerRepository: Repository<GroupQuestionAnswer>,
    private readonly groupService: GroupService,
    private readonly groupQuestionService: GroupQuestionService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    props: DeepPartial<GroupQuestionAnswer>,
  ): Promise<GroupQuestionAnswer> {
    return this.groupQuestionAnswerRepository.create(props);
  }

  async createMany(
    props: DeepPartial<GroupQuestionAnswer>[],
  ): Promise<GroupQuestionAnswer[]> {
    return this.groupQuestionAnswerRepository.create(props);
  }

  async save(
    props: DeepPartial<GroupQuestionAnswer>,
  ): Promise<GroupQuestionAnswer> {
    return this.groupQuestionAnswerRepository.save(props);
  }

  async saveBulk(
    props: DeepPartial<GroupQuestionAnswer>[],
  ): Promise<GroupQuestionAnswer[]> {
    return this.groupQuestionAnswerRepository.save(props);
  }

  async findOne(
    find?: FindOneOptions<GroupQuestionAnswer>,
  ): Promise<GroupQuestionAnswer> {
    return this.groupQuestionAnswerRepository.findOne({ ...find });
  }

  async find(
    find: FindManyOptions<GroupQuestionAnswer>,
  ): Promise<GroupQuestionAnswer[]> {
    return this.groupQuestionAnswerRepository.find(find);
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupQuestionAnswer>,
  ): Promise<GroupQuestionAnswer> {
    return this.groupQuestionAnswerRepository.findOneBy({ ...find });
  }

  async getGroupQuestionAnswerPaginatedList({
    dto,
    group,
    groupQuestion,
  }: {
    user?: User;
    dto: GroupQuestionAnswerListDto;
    group: Group;
    groupQuestion: GroupQuestion;
  }) {
    const { page, perPage, sort, availableSort, availableSearch } = dto;

    const queryBuilder = this.getListSearchBuilder({
      groupId: group.id,
      groupQuestionId: groupQuestion.id,
    });

    const paginatedResult = await this.paginationService.getPaginatedData({
      queryBuilder,
      options: {
        take: perPage,
        order: sort,
        page,
      },
    });

    return {
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      ...paginatedResult,
    };
  }

  private getListSearchBuilder({
    groupId,
    groupQuestionId,
  }: IGroupQuestionAnswerSearch) {
    return this.groupQuestionAnswerRepository
      .createQueryBuilder('groupQuestionAnswer')
      .innerJoin('groupQuestionAnswer.question', 'question')
      .innerJoin('question.group', 'group')
      .setParameters({ groupId, groupQuestionId })
      .where('groupQuestionAnswer.group_question_id = :groupQuestionId')
      .andWhere('question.group_id = :groupId');
  }

  createAnswer({
    user,
    dto,
    groupQuestion,
  }: {
    user: User;
    dto: GroupQuestionAnswerCreateDto;
    groupQuestion: GroupQuestion;
  }) {
    const answer = this.groupQuestionAnswerRepository.create({
      data: dto.data,
      createdBy: user,
      question: groupQuestion,
    });

    return this.groupQuestionAnswerRepository.save(answer);
  }

  async updateAnswer({
    user,
    dto,
    id,
  }: {
    user: User;
    dto: GroupQuestionAnswerUpdateDto;
    id: string;
  }) {
    const answer = await this.groupQuestionAnswerRepository.findOneBy({
      id,
      createdBy: {
        id: user.id,
      },
    });

    if (!answer) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumGroupQuestionAnswerStatusCodeError.GroupQuestionAnswerNotFoundError,
        message: 'group.question.answer.error.notFound',
      });
    }

    return this.groupQuestionAnswerRepository.save({
      ...answer,
      data: dto.data,
    });
  }

  async removeAnswer({ user, id }: { user: User; id: string }) {
    const answer = await this.groupQuestionAnswerRepository.findOneBy({
      id,
      createdBy: {
        id: user.id,
      },
    });

    if (!answer) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumGroupQuestionAnswerStatusCodeError.GroupQuestionAnswerNotFoundError,
        message: 'group.question.answer.error.notFound',
      });
    }

    return this.groupQuestionAnswerRepository.remove(answer);
  }
}
