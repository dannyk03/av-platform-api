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
  SocialNetworkingService,
} from '../service';
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
    private readonly socialNetworkingService: SocialNetworkingService,
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

      const createSocialConnectionRequest =
        await this.socialConnectionRequestService.create({
          addressedUser: reqUser,
          addresseeUser,
          tempAddresseeEmail: addresseeUser ? null : email,
        });

      const saveSocialConnectionRequest =
        await this.socialConnectionRequestService.save(
          createSocialConnectionRequest,
        );

      if (saveSocialConnectionRequest) {
        const isEmailSent = addresseeUser
          ? await this.emailService.sendNetworkNewConnectionRequest({
              fromUser: reqUser,
              email,
            })
          : await this.emailService.sendNetworkJoinInvite({
              fromUser: reqUser,
              email,
            });

        if (isEmailSent) {
          return Promise.resolve(email);
        }
        return Promise.reject(email);
      } else {
        return Promise.reject(email);
      }
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

    const result =
      await this.socialNetworkingService.approveSocialConnectionsRequests(
        userConnectionsRequestFind,
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
