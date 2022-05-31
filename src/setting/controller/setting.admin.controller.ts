import {
    Body,
    Controller,
    InternalServerErrorException,
    Put,
} from '@nestjs/common';
import { AuthAdminJwtGuard } from '@/auth/auth.decorator';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { Permissions } from '@/permission/permission.constant';
import { StatusCodeError } from '@/utils/error/error.constant';
import { RequestParamGuard } from '@/utils/request/request.decorator';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { SettingGetDto } from '../dto/setting.request.dto';
import { SettingUpdateDto } from '../dto/setting.update.dto';
import { SettingDocument } from '../schema/setting.schema';
import { SettingService } from '../service/setting.service';
import { GetSetting, SettingUpdateGuard } from '../setting.decorator';

@Controller({
    version: '1',
    path: 'setting',
})
export class SettingAdminController {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly settingService: SettingService,
    ) {}

    @Response('setting.update')
    @SettingUpdateGuard()
    @RequestParamGuard(SettingGetDto)
    @AuthAdminJwtGuard(Permissions.SettingsRead, Permissions.SettingsUpdate)
    @Put('/update/:setting')
    async update(
        @GetSetting() setting: SettingDocument,
        @Body()
        body: SettingUpdateDto,
    ): Promise<IResponse> {
        try {
            await this.settingService.updateOneById(setting._id, body);
        } catch (err: any) {
            this.debuggerService.error(
                'update try catch',
                'SettingController',
                'update',
                err,
            );

            throw new InternalServerErrorException({
                statusCode: StatusCodeError.UnknownError,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: setting._id,
        };
    }
}
