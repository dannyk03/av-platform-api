import { Injectable } from '@nestjs/common';

import { buildPaginator } from 'typeorm-cursor-pagination';

import { Group } from '@/group/entity';

import { GroupService } from '@/group/service';

import { unescapeString } from '../utils';

@Injectable()
export class StringEscapeRevertGroupsCommandService {
  constructor(private readonly groupService: GroupService) {}

  async run(): Promise<void> {
    const queryBuilder = await this.groupService.getAllGroupsQueryBuilder();
    let afterCursor = null;
    do {
      const paginator = buildPaginator({
        entity: Group,
        query: {
          limit: 50,
          afterCursor,
        },
      });

      // Pass queryBuilder as parameter to get paginate result.
      const { data, cursor } = await paginator.paginate(queryBuilder);
      const newData = data.map((group: Group) => {
        return {
          ...group,
          name: unescapeString(group.name),
          description: unescapeString(group.description),
        };
      });
      await this.groupService.saveBulk(newData);
      afterCursor = cursor.afterCursor;
    } while (afterCursor);
  }
}
