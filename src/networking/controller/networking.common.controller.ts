import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
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
import { EmailService } from '@/messaging/email/service';
import { UserService } from '@/user/service';
import { HelperPromiseService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import {
  SocialConnectionListDto,
  SocialConnectionRequestApproveDto,
  SocialConnectionRequestDto,
  SocialConnectionRequestListDto,
  SocialConnectionRequestRejectDto,
} from '../dto';
import { RefQueryParamOptionalDto } from '@/utils/request/dto';

import {
  SocialConnectionGetSerialization,
  SocialConnectionRequestGetSerialization,
} from '../serialization';

import { EnumLogAction } from '@/log/constant';

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

  @ClientResponse('networking.connectRequest')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SendConnectionRequest, {
    tags: ['networking'],
  })
  @AclGuard()
  @Post('/connect')
  async connect(
    @ReqAuthUser()
    reqUser: User,
    @Body()
    {
      addressees,
      personalNote: sharedPersonalNote,
    }: SocialConnectionRequestDto,
  ): Promise<IResponseData> {
    const requestingUserWithProfile = await this.userService.findOne({
      where: { id: reqUser.id },
      relations: ['profile'],
      select: {
        id: true,
        profile: {
          firstName: true,
        },
      },
    });

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
          addresserUser: reqUser,
          addresseeUser,
          tempAddresseeEmail: addresseeUser ? null : email,
        });

      const saveSocialConnectionRequest =
        await this.socialConnectionRequestService.save(
          createSocialConnectionRequest,
        );

      let isEmailSent;
      if (saveSocialConnectionRequest) {
        if (!addresseeUser) {
          isEmailSent = await this.emailService.sendConnectionRequestNewUser({
            personalNote: saveSocialConnectionRequest.personalNote,
            requestingUser: requestingUserWithProfile,
            email:
              saveSocialConnectionRequest.addresseeUser?.email ||
              saveSocialConnectionRequest.tempAddresseeEmail,
            connectionId: saveSocialConnectionRequest.id,
          });
        } else {
          const receivingUserWithProfile = await this.userService.findOne({
            where: { id: saveSocialConnectionRequest.addresseeUser.id },
            relations: ['profile'],
            select: {
              id: true,
              profile: {
                firstName: true,
              },
            },
          });

          isEmailSent =
            await this.emailService.sendConnectionRequestExistingUser({
              personalNote: saveSocialConnectionRequest.personalNote,
              requestingUser: requestingUserWithProfile,
              receivingUser: receivingUserWithProfile,
              email:
                saveSocialConnectionRequest.addresseeUser?.email ||
                saveSocialConnectionRequest.tempAddresseeEmail,
              connectionId: saveSocialConnectionRequest.id,
            });
        }

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

  @ClientResponsePaging('networking.connectRequestList', {
    classSerialization: SocialConnectionRequestGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/connect/list')
  async listConnectRequests(
    @ReqAuthUser()
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
  @ClientResponsePaging('networking.connectionsList', {
    classSerialization: SocialConnectionGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/list')
  async listConnections(
    @ReqAuthUser()
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

  @ClientResponse('networking.connectApprove')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.ApproveConnectionRequest, {
    tags: ['networking'],
  })
  @AclGuard()
  @Patch('/approve')
  async approve(
    @Query()
    { ref }: RefQueryParamOptionalDto,
    @Body()
    { connectionRequestIds }: SocialConnectionRequestApproveDto,
    @ReqAuthUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.findPendingConnectionRequestByRequestIdsOrRequestId(
        {
          connectionRequestId: ref,
          reqUserId: reqUser.id,
          connectionRequestIds,
        },
      );

    if (!userConnectionsRequestFind?.length) {
      throw new NotFoundException({
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

  @ClientResponse('networking.connectReject')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.RejectConnectionRequest, {
    tags: ['networking'],
  })
  @AclGuard()
  @Patch('/reject')
  async reject(
    @Query()
    { ref }: RefQueryParamOptionalDto,
    @Body()
    { connectionRequestIds }: SocialConnectionRequestRejectDto,
    @ReqAuthUser() reqUser: User,
  ): Promise<IResponseData> {
    const userConnectionsRequestFind =
      await this.socialConnectionRequestService.findPendingConnectionRequestByRequestIdsOrRequestId(
        {
          connectionRequestId: ref,
          reqUserId: reqUser.id,
          connectionRequestIds,
        },
      );

    if (!userConnectionsRequestFind?.length) {
      throw new NotFoundException({
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
