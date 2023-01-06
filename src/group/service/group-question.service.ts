import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { isNumber } from 'class-validator';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Group, GroupQuestion } from '@/group/entity';
import { User } from '@/user/entity';

import { GroupService } from '@/group/service/group.service';
import { PaginationService } from '@/utils/pagination/service';

import { IGroupQuestionSearch } from '@/group/type';

import { GroupQuestionListDto } from '@/group/dto';
import { GroupQuestionCreateDto } from '@/group/dto/group-question.create.dto';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupQuestionService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupQuestion, ConnectionNames.Default)
    private readonly groupQuestionRepository: Repository<GroupQuestion>,
    private readonly groupService: GroupService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(props: DeepPartial<GroupQuestion>): Promise<GroupQuestion> {
    return this.groupQuestionRepository.create(props);
  }

  async createMany(
    props: DeepPartial<GroupQuestion>[],
  ): Promise<GroupQuestion[]> {
    return this.groupQuestionRepository.create(props);
  }

  async save(props: DeepPartial<GroupQuestion>): Promise<GroupQuestion> {
    return this.groupQuestionRepository.save(props);
  }

  async saveBulk(
    props: DeepPartial<GroupQuestion>[],
  ): Promise<GroupQuestion[]> {
    return this.groupQuestionRepository.save(props);
  }

  async findOne(find?: FindOneOptions<GroupQuestion>): Promise<GroupQuestion> {
    return this.groupQuestionRepository.findOne({ ...find });
  }

  async find(find: FindManyOptions<GroupQuestion>): Promise<GroupQuestion[]> {
    return this.groupQuestionRepository.find(find);
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupQuestion>,
  ): Promise<GroupQuestion> {
    return this.groupQuestionRepository.findOneBy({ ...find });
  }

  async createGroupQuestion(
    user: User,
    dto: GroupQuestionCreateDto,
    group: Group,
  ) {
    const groupQuestion = this.groupQuestionRepository.create({
      ...dto,
      createdBy: user,
      group,
    });

    // todo - A20-414 send email to groupMembers
    return this.groupQuestionRepository.save(groupQuestion);
  }

  async getGroupPaginatedList(
    user: User,
    dto: GroupQuestionListDto,
    group: Group,
  ) {
    const { page, perPage, sort, availableSort, availableSearch } = dto;

    const skip: number = await this.paginationService.skip(page, perPage);

    const groupQuestions = await this.paginatedSearchBy({
      groupId: group.id,
      options: {
        skip,
        take: perPage,
        order: sort,
      },
    });

    const totalData = await this.getTotal({ groupId: group.id });

    const totalPage = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: groupQuestions,
    };
  }

  private paginatedSearchBy({ groupId, options }: IGroupQuestionSearch) {
    const builder = this.getListSearchBuilder({ groupId });

    if (options.order) {
      builder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      builder.take(options.take).skip(options.skip);
    }

    return builder.getMany();
  }

  private getListSearchBuilder({ groupId }: IGroupQuestionSearch) {
    return this.groupQuestionRepository
      .createQueryBuilder('groupQuestion')
      .select(['groupQuestion'])
      .setParameters({ groupId })
      .loadRelationCountAndMap(
        'groupQuestion.answersCount',
        'groupQuestion.answers',
      )
      .where('groupQuestion.group_id = :groupId');
  }

  getTotal({ groupId }: IGroupQuestionSearch) {
    return this.getListSearchBuilder({
      groupId,
    }).getCount();
  }
}
