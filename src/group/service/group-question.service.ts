import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

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

import { GroupQuestionAnswerService } from '@/group/service/group-question-answer.service';
import { GroupService } from '@/group/service/group.service';
import { PaginationService } from '@/utils/pagination/service';

import { IGroupQuestionSearch } from '@/group/type';

import { GroupQuestionCreateDto, GroupQuestionListDto } from '@/group/dto';

import { ConnectionNames } from '@/database/constant';

import { GroupQuestionEmailProducer } from '@/jobs/producer/group/group-question/group-question-email.producer';

@Injectable()
export class GroupQuestionService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupQuestion, ConnectionNames.Default)
    private readonly groupQuestionRepository: Repository<GroupQuestion>,
    private readonly groupQuestionAnswerService: GroupQuestionAnswerService,
    private readonly groupService: GroupService,
    private readonly paginationService: PaginationService,
    @Optional()
    private readonly groupQuestionEmailProducer: GroupQuestionEmailProducer,
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

  async remove(question: GroupQuestion): Promise<GroupQuestion> {
    return this.groupQuestionRepository.remove(question);
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

    const savedGroupQuestion = await this.groupQuestionRepository.save(
      groupQuestion,
    );
    this.groupQuestionEmailProducer?.groupCreatedEmail(savedGroupQuestion);

    return savedGroupQuestion;
  }

  async getGroupQuestionPaginatedList(
    user: User,
    dto: GroupQuestionListDto,
    group: Group,
  ) {
    const { page, perPage, sort, availableSort, availableSearch } = dto;

    const queryBuilder = this.getListSearchBuilder({
      groupId: group.id,
    });

    const { totalData, totalPage, data } =
      await this.paginationService.getPaginatedData({
        queryBuilder,
        options: {
          take: perPage,
          order: sort,
          page,
        },
      });

    const randomGroupQuestions =
      await this.groupQuestionAnswerService.findRandomGroupQuestions({
        questionIds: data?.map((group) => group.id),
      });

    const mappedGroupsToRandomAnswers = this.mapGroupAnswersToQuestion(
      data,
      randomGroupQuestions,
    );

    return {
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      totalData,
      totalPage,
      data: mappedGroupsToRandomAnswers,
    };
  }

  private mapGroupAnswersToQuestion(
    groupQuestions: GroupQuestion[],
    answers: GroupQuestionAnswer[],
  ) {
    return groupQuestions.map((groupQuestion) => {
      const groupAnswers = answers.filter(
        (answer) => answer.question.id === groupQuestion.id,
      );
      return {
        ...groupQuestion,
        answers: groupAnswers,
      };
    });
  }

  private getListSearchBuilder({ groupId }: IGroupQuestionSearch) {
    return this.groupQuestionRepository
      .createQueryBuilder('groupQuestion')
      .select(['groupQuestion'])
      .leftJoinAndSelect('groupQuestion.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.profile', 'profile')
      .setParameters({ groupId })
      .loadRelationCountAndMap(
        'groupQuestion.answersCount',
        'groupQuestion.answers',
      )
      .where('groupQuestion.group_id = :groupId');
  }

  findGroupQuestion({
    userId,
    groupId,
    groupQuestionId,
  }: {
    userId?: string;
    groupId: string;
    groupQuestionId: string;
  }) {
    const where: FindOneOptions<GroupQuestion>['where'] = {
      group: {
        id: groupId,
      },
      id: groupQuestionId,
    };

    if (userId) {
      where.createdBy = {
        id: userId,
      };
    }

    return this.groupQuestionRepository.findOne({
      where,
    });
  }
}
