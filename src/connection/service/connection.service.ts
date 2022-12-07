import { Injectable } from '@nestjs/common';

import { GroupService } from '@/group/service';
import { SocialConnectionService } from '@/networking/service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly groupService: GroupService,
    private readonly socialConnectionService: SocialConnectionService,
  ) {}

  async checkConnection({
    user1Id,
    user2Id,
    options,
  }: {
    user1Id: string;
    user2Id: string;
    options?: { skipNetwork: boolean; skipGroups: boolean };
  }): Promise<{
    networkConnection: boolean | null;
    groupConnection: boolean | null;
  }> {
    const skipNetwork = options?.skipNetwork ?? false;
    const skipGroups = options?.skipGroups ?? false;

    const [networkRes, groupsRes] = await Promise.all([
      skipNetwork
        ? Promise.resolve(null)
        : this.socialConnectionService.checkIsBiDirectionalSocialConnectedByIds(
            {
              user1Id,
              user2Id,
            },
          ),
      skipGroups
        ? Promise.resolve(null)
        : this.groupService.findCommonGroups({
            user1Id,
            user2Id,
            options: { onlyCount: true },
          }),
    ]);

    const isCommonGroups =
      groupsRes && 'count' in groupsRes && groupsRes.count > 0;

    return {
      networkConnection: networkRes,
      groupConnection: isCommonGroups,
    };
  }
}
