import { Injectable } from '@nestjs/common';

import { buildPaginator } from 'typeorm-cursor-pagination';

import { Group } from '@/group/entity';

import { GroupService } from '@/group/service';
import { HelperHashService } from '@/utils/helper/service';

@Injectable()
export class GroupShortCodePopulateCommandService {
  constructor(
    private readonly groupService: GroupService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async run(): Promise<void> {
    try {
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
        const newData = await Promise.all(
          data.map(async (group: Group) => {
            return {
              ...group,
              code: await this.helperHashService.easilyReadableCode(),
            };
          }),
        );

        await this.groupService.saveBulk(newData);
        afterCursor = cursor.afterCursor;
      } while (afterCursor);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
