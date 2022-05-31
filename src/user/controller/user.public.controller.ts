import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { AuthPublicJwtGuard } from '@/auth/auth.decorator';
import { IAwsS3Response } from '@/aws/aws.interface';
import { AwsS3Service } from '@/aws/service/aws.s3.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { StatusCodeError } from '@/utils/error/error.constant';
import { FileType } from '@/utils/file/file.constant';
import { UploadFileSingle } from '@/utils/file/file.decorator';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { UserService } from '../service/user.service';
import { GetUser, UserProfileGuard } from '../user.decorator';
import { IUserDocument } from '../user.interface';

@Controller({
    version: '1',
    path: 'user',
})
export class UserPublicController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly awsService: AwsS3Service,
    ) {}

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @Get('/profile')
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationProfile(user);
    }

    @Response('user.upload')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', FileType.Image)
    @HttpCode(HttpStatus.OK)
    @Post('/profile/upload')
    async upload(
        @GetUser() user: IUserDocument,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<void> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();

        const path = await this.userService.createRandomFilename();

        try {
            const aws: IAwsS3Response = await this.awsService.putItemInBucket(
                `${path.filename}.${mime}`,
                content,
                {
                    path: `${path.path}/${user._id}`,
                },
            );

            await this.userService.updatePhoto(user._id, aws);
        } catch (err) {
            this.debuggerService.error(
                'Store photo user',
                'UserPublicController',
                'upload',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
