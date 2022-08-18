import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import {
  EnumNetworkingConnectionRequestStatus,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { In } from 'typeorm';

import { User } from '@/user/entity';

import {
  FriendshipRequestBlockService,
  FriendshipRequestService,
  FriendshipService,
} from '../service';
import { UserService } from '@/user/service';
import { PaginationService } from '@/utils/pagination/service';

import { ProductGetSerialization } from '@/catalog/product/serialization';

import { ConnectRequestDto, ConnectRequestListDto } from '../dto';
import { ProductListDto } from '@/catalog/product/dto';

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
    private readonly friendshipRequestService: FriendshipRequestService,
    private readonly friendshipRequestBlockService: FriendshipRequestBlockService,
    private readonly emailService: EmailService,
    private readonly paginationService: PaginationService,
  ) {}

  @Response('networking.connectRequest')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Post('/connect')
  async connect(
    @ReqUser()
    reqUser: User,
    @Body() { to }: ConnectRequestDto,
  ): Promise<IResponseData> {
    const promises = to.map(async (email) => {
      const [findExistingRequest, findBlockRequest] = await Promise.all([
        this.friendshipRequestService.findFriendshipRequestByStatus({
          fromEmail: reqUser.email,
          toEmail: email,
          status: [
            EnumNetworkingConnectionRequestStatus.Approved,
            EnumNetworkingConnectionRequestStatus.Pending,
          ],
        }),
        this.friendshipRequestBlockService.findBlockRequest({
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
          const createFriendshipRequest =
            await this.friendshipRequestService.create({
              addressedUser: reqUser,
              tempAddresseeEmail: addresseeUser ? null : email,
            });

          const saveFriendshipRequest = this.friendshipRequestService.save(
            createFriendshipRequest,
          );

          if (saveFriendshipRequest) {
            return Promise.resolve(email);
          }
        } else {
          return Promise.reject(email);
        }
      }

      const createFriendshipRequest =
        await this.friendshipRequestService.create({
          addressedUser: reqUser,
          addresseeUser,
        });

      const saveFriendshipRequest = this.friendshipRequestService.save(
        createFriendshipRequest,
      );

      if (saveFriendshipRequest) {
        return Promise.resolve(email);
      }

      return Promise.reject(email);
    });

    const res = await Promise.allSettled(promises);

    return res.reduce((acc, promiseValue) => {
      if ('value' in promiseValue) {
        acc[promiseValue.value] =
          promiseValue.status === 'fulfilled' ? 'success' : 'fail';
      }
      return acc;
    }, {});
  }

  @ResponsePaging('networking.connectRequestList')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/connect/list')
  async list(
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
    }: ConnectRequestListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const connectRequest =
      await this.friendshipRequestService.paginatedSearchBy({
        options: {
          skip: skip,
          take: perPage,
          order: sort,
        },
        status,
        search,
        addresseeEmail: reqUser.email,
      });

    const totalData = await this.friendshipRequestService.getTotal({
      status,
      search,
      addresseeEmail: reqUser.email,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    const data =
      await this.friendshipRequestService.serializationConnectionRequestList(
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
}
