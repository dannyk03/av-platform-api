import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumNetworkingConnectionRequestStatus,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { DataSource, In } from 'typeorm';

import { User } from '@/user/entity';

import {
  SocialConnectionRequestBlockService,
  SocialConnectionRequestService,
  SocialConnectionService,
} from '../service';
import { LogService } from '@/log/service';
import { UserService } from '@/user/service';
import { HelperPromiseService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import {
  ConnectRequestUpdateDto,
  SocialConnectionListDto,
  SocialConnectionRequestDto,
  SocialConnectionRequestListDto,
} from '../dto';

import { AclGuard } from '@/auth';
import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class NetworkingCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly paginationService: PaginationService,
    private readonly helperPromiseService: HelperPromiseService,
    private readonly socialConnectionService: SocialConnectionService,
    private readonly socialConnectionRequestService: SocialConnectionRequestService,
    private readonly socialConnectionRequestBlockService: SocialConnectionRequestBlockService,
  ) {}

  @Response('networking.connectRequest')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Post('/connect')
  async connect(
    @ReqUser()
    reqUser: User,
    @Body() { emails }: SocialConnectionRequestDto,
  ): Promise<IResponseData> {
    const promises = emails.map(async (email) => {
      if (email === reqUser.email) {
        return Promise.reject(email);
      }

      const [findExistingRequest, findBlockRequest] = await Promise.all([
        this.socialConnectionRequestService.findSocialConnectionRequestByStatus(
          {
            fromEmail: reqUser.email,
            toEmail: email,
            status: [
              EnumNetworkingConnectionRequestStatus.Approved,
              EnumNetworkingConnectionRequestStatus.Pending,
            ],
          },
        ),
        this.socialConnectionRequestBlockService.findBlockRequest({
          fromEmail: reqUser.email,
          toEmail: email,
        }),
      ]);

      if (findExistingRequest || findBlockRequest) {
        return Promise.resolve(email);
      }

      const addresseeUser = await this.userService.findOneBy({ email });

      if (!addresseeUser) {
        const isEmailSent = await this.emailService.sendNetworkJoinInvite({
          fromUser: reqUser,
          email,
        });

        if (isEmailSent) {
          const createSocialConnectionRequest =
            await this.socialConnectionRequestService.create({
              addressedUser: reqUser,
              tempAddresseeEmail: addresseeUser ? null : email,
            });

          const saveSocialConnectionRequest =
            this.socialConnectionRequestService.save(
              createSocialConnectionRequest,
            );

          if (saveSocialConnectionRequest) {
            return Promise.resolve(email);
          }
        } else {
          return Promise.reject(email);
        }
      }

      const createSocialConnectionRequest =
        await this.socialConnectionRequestService.create({
          addressedUser: reqUser,
          addresseeUser,
        });

      const saveSocialConnectionRequest =
        this.socialConnectionRequestService.save(createSocialConnectionRequest);

      if (saveSocialConnectionRequest) {
        return Promise.resolve(email);
      }

      return Promise.reject(email);
    });

    const result = await Promise.allSettled(promises);

    return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
      result,
    );
  }

  @ResponsePaging('networking.connectRequestList')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/connect/list')
  async listConnectRequests(
    @ReqUser()
    reqUser: User,
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
      status,
    }: SocialConnectionRequestListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const connectRequest =
      await this.socialConnectionRequestService.paginatedSearchBy({
        options: {
          skip: skip,
          take: perPage,
          order: sort,
        },
        status,
        search,
        addresseeEmail: reqUser.email,
      });

    const totalData = await this.socialConnectionRequestService.getTotal({
      status,
      search,
      addresseeEmail: reqUser.email,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data =
      await this.socialConnectionRequestService.serializationSocialConnectionRequestList(
        connectRequest,
      );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }
  @ResponsePaging('networking.connectionsList')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/list')
  async listConnections(
    @ReqUser()
    reqUser: User,
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
    }: SocialConnectionListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const socialConnections =
      await this.socialConnectionService.paginatedSearchBy({
        options: {
          skip: skip,
          take: perPage,
          order: sort,
        },

        search,
        userEmail: reqUser.email,
      });

    const totalData = await this.socialConnectionService.getTotal({
      search,
      userEmail: reqUser.email,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data =
      await this.socialConnectionService.serializationSocialConnectionList(
        socialConnections,
      );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data,
    };
  }

  @Response('networking.connectApprove')
  @AclGuard()
  @Patch('/approve')
  async approve(
    @Body()
    { socialConnectionRequestIds: connectRequestIds }: ConnectRequestUpdateDto,
    @ReqUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.find({
        where: {
          id: In(connectRequestIds),
          status: EnumNetworkingConnectionRequestStatus.Pending,
          addresseeUser: {
            id: reqUser.id,
          },
        },
        relations: ['addressedUser', 'addresseeUser'],
        select: {
          addressedUser: {
            id: true,
            email: true,
          },
          addresseeUser: {
            id: true,
            email: true,
          },
        },
      });

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        return await Promise.allSettled(
          userConnectionsRequestFind.map(async (connectionRequest) => {
            const { addressedUser, addresseeUser } = connectionRequest;

            const createSocialConnection1 =
              await this.socialConnectionService.create({
                user1: addressedUser,
                user2: addresseeUser,
              });
            const createSocialConnection2 =
              await this.socialConnectionService.create({
                user1: addresseeUser,
                user2: addressedUser,
              });

            connectionRequest.status =
              EnumNetworkingConnectionRequestStatus.Approved;

            await transactionalEntityManager.save(connectionRequest);

            const saveSocialConnection = await transactionalEntityManager.save([
              createSocialConnection1,
              createSocialConnection2,
            ]);

            if (saveSocialConnection) {
              return Promise.resolve(addressedUser.email);
            }
            return Promise.reject(addressedUser.email);
          }),
        );
      },
    );

    return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
      result,
    );
  }

  @Response('networking.connectReject')
  @AclGuard()
  @Patch('/reject')
  async reject(
    @Body()
    { socialConnectionRequestIds }: ConnectRequestUpdateDto,
    @ReqUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.find({
        where: {
          id: In(socialConnectionRequestIds),
          status: EnumNetworkingConnectionRequestStatus.Pending,
          addresseeUser: {
            id: reqUser.id,
          },
        },
        relations: ['addressedUser', 'addresseeUser'],
        select: {
          addressedUser: {
            id: true,
            email: true,
          },
          addresseeUser: {
            id: true,
            email: true,
          },
        },
      });

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        return await Promise.allSettled(
          userConnectionsRequestFind.map(async (connectionRequest) => {
            const { addressedUser } = connectionRequest;

            connectionRequest.status =
              EnumNetworkingConnectionRequestStatus.Rejected;

            const updateConnectRequest = await transactionalEntityManager.save(
              connectionRequest,
            );

            if (updateConnectRequest) {
              return Promise.resolve(addressedUser.email);
            }
            return Promise.reject(addressedUser.email);
          }),
        );
      },
    );

    return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
      result,
    );
  }
}
