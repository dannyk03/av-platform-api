import { Injectable } from '@nestjs/common';

import { buildPaginator } from 'typeorm-cursor-pagination';

import { User } from '@/user/entity';

import { UserService } from '@/user/service';

import { unescapeString } from '../utils';

@Injectable()
export class StringEscapeRevertUsersCommandService {
  constructor(private readonly userService: UserService) {}

  async run(): Promise<void> {
    const queryBuilder = await this.userService.getAllUsersQueryBuilder();
    let afterCursor = null;
    do {
      const paginator = buildPaginator({
        entity: User,
        query: {
          limit: 50,
          afterCursor,
        },
      });

      // Pass queryBuilder as parameter to get paginate result.
      const { data, cursor } = await paginator.paginate(queryBuilder);
      const newData: User[] = data.map((user: User) => {
        return {
          ...user,
          profile: {
            ...user.profile,
            firstName: unescapeString(user.profile?.firstName),
            lastName: unescapeString(user.profile?.lastName),
            home: {
              ...user.profile.home,
              city: unescapeString(user.profile.home?.city),
              state: unescapeString(user.profile.home?.state),
              country: unescapeString(user.profile.home?.country),
            },
            shipping: {
              ...user.profile.shipping,
              deliveryInstructions: unescapeString(
                user.profile.shipping?.deliveryInstructions,
              ),
              addressLine1: unescapeString(user.profile.shipping?.addressLine1),
              addressLine2: unescapeString(user.profile.shipping?.addressLine2),
              city: unescapeString(user.profile.shipping?.city),
              state: unescapeString(user.profile.shipping?.state),
              country: unescapeString(user.profile.shipping?.country),
              zipCode: unescapeString(user.profile.shipping?.zipCode),
            },
            company: {
              ...user.profile.company,
              name: unescapeString(user.profile.company?.name),
              department: unescapeString(user.profile.company?.department),
            },
          },
        } as User;
      });
      await this.userService.saveBulk(newData);
      afterCursor = cursor.afterCursor;
    } while (afterCursor);
  }
}
