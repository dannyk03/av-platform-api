import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumNetworkingConnectionRequestStatus } from '@avo/type';

import { DataSource } from 'typeorm';

import { SocialConnectionRequest } from '../entity';

import { SocialConnectionRequestBlockService } from './social-connection-request-block.service';
import { SocialConnectionRequestService } from './social-connection-request.service';
import { SocialConnectionService } from './social-connection.service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class SocialNetworkingService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly socialConnectionService: SocialConnectionService,
    private readonly socialConnectionRequestService: SocialConnectionRequestService,
    private readonly socialConnectionRequestBlockService: SocialConnectionRequestBlockService,
  ) {}

  async rejectSocialConnectionsRequests(
    connectionRequests: SocialConnectionRequest[],
  ) {
    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        return Promise.allSettled(
          connectionRequests.map(async (connectionRequest) => {
            const { addresserUser } = connectionRequest;

            connectionRequest.status =
              EnumNetworkingConnectionRequestStatus.Rejected;

            const updateConnectRequest = await transactionalEntityManager.save(
              connectionRequest,
            );

            if (updateConnectRequest) {
              return Promise.resolve(addresserUser.email);
            }
            return Promise.reject(addresserUser.email);
          }),
        );
      },
    );
  }

  async approveSocialConnectionsRequests(
    connectionRequests: SocialConnectionRequest[],
  ) {
    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        return Promise.allSettled(
          connectionRequests.map(async (connectionRequest) => {
            const { addresserUser, addresseeUser } = connectionRequest;

            const createSocialConnection1 =
              await this.socialConnectionService.create({
                user1: addresserUser,
                user2: addresseeUser,
              });
            const createSocialConnection2 =
              await this.socialConnectionService.create({
                user1: addresseeUser,
                user2: addresserUser,
              });

            connectionRequest.status =
              EnumNetworkingConnectionRequestStatus.Approved;

            await transactionalEntityManager.save(connectionRequest);

            const updateSocialConnection =
              await transactionalEntityManager.save([
                createSocialConnection1,
                createSocialConnection2,
              ]);

            if (updateSocialConnection) {
              return Promise.resolve(addresserUser.email);
            }
            return Promise.reject(addresserUser.email);
          }),
        );
      },
    );
  }
}
