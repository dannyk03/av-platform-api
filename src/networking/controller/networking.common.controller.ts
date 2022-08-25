import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  EnumNetworkingConnectionRequestStatus,
  EnumNetworkingStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

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

import { SocialConnectionRequestGetSerialization } from '../serialization';
import { SocialConnectionGetSerialization } from '../serialization';

import {
  ConnectRequestUpdateDto,
  SocialConnectionListDto,
  SocialConnectionRequestDto,
  SocialConnectionRequestListDto,
} from '../dto';
import { EmailQueryParamOptionalDto } from '@/utils/request/dto';

import { AclGuard } from '@/auth';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
})
export class NetworkingCommonController {
  constructor(
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
    @Body()
    {
      addressees,
      personalNote: sharedPersonalNote,
    }: SocialConnectionRequestDto,
  ): Promise<IResponseData> {
    const promises = addressees.map(async ({ email, personalNote }) => {
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
          personalNote: personalNote || sharedPersonalNote,
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
              personalNote: saveSocialConnectionRequest.personalNote,
              fromUser: saveSocialConnectionRequest.addressedUser,
              email:
                saveSocialConnectionRequest.addresseeUser?.email ||
                saveSocialConnectionRequest.tempAddresseeEmail,
            })
          : await this.emailService.sendNetworkJoinInvite({
              personalNote: saveSocialConnectionRequest.personalNote,
              fromUser: saveSocialConnectionRequest.addressedUser,
              email:
                saveSocialConnectionRequest.addresseeUser?.email ||
                saveSocialConnectionRequest.tempAddresseeEmail,
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

  @ResponsePaging('networking.connectRequestList', {
    classSerialization: SocialConnectionRequestGetSerialization,
  })
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

    const connectionRequests =
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

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: connectionRequests,
    };
  }
  @ResponsePaging('networking.connectionsList', {
    classSerialization: SocialConnectionGetSerialization,
  })
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

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: socialConnections,
    };
  }

  @Response('networking.connectApprove')
  @AclGuard()
  @Patch('/approve')
  async approve(
    @Query()
    { email }: EmailQueryParamOptionalDto,
    @Body()
    { socialConnectionRequestIds }: ConnectRequestUpdateDto,
    @ReqUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.findPendingSocialConnectionRequestByEmailOrIds(
        {
          email,
          socialConnectionRequestIds,
          reqUserId: reqUser.id,
        },
      );

    if (!userConnectionsRequestFind?.length) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumNetworkingStatusCodeError.NetworkingConnectionRequestsNotFoundError,
        message: 'networking.error.requestNotFound',
      });
    }

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
    @Query()
    { email }: EmailQueryParamOptionalDto,
    @Body()
    { socialConnectionRequestIds }: ConnectRequestUpdateDto,
    @ReqUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.findPendingSocialConnectionRequestByEmailOrIds(
        {
          email,
          socialConnectionRequestIds,
          reqUserId: reqUser.id,
        },
      );

    if (!userConnectionsRequestFind?.length) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumNetworkingStatusCodeError.NetworkingConnectionRequestsNotFoundError,
        message: 'networking.error.requestNotFound',
      });
    }

    if (!userConnectionsRequestFind.length) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumNetworkingStatusCodeError.NetworkingConnectionRequestsNotFoundError,
        message: 'networking.error.requestNotFound',
      });
    }

    const result =
      await this.socialNetworkingService.rejectSocialConnectionsRequests(
        userConnectionsRequestFind,
      );

    return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
      result,
    );
  }
}
