import {
    Injectable,
    NestMiddleware,
    ServiceUnavailableException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { SettingDocument } from '@/setting/schema/setting.schema';
import { SettingService } from '@/setting/service/setting.service';
import { StatusCodeError } from '@/utils/error/error.constant';
import { IRequestApp } from '@/utils/request/request.interface';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
    constructor(private readonly settingService: SettingService) {}

    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const maintenance: SettingDocument =
            await this.settingService.findOneByName('maintenance');

        if (maintenance?.value as boolean) {
            throw new ServiceUnavailableException({
                statusCode: StatusCodeError.ServiceUnavailable,
                message: 'http.serverError.serviceUnavailable',
            });
        }

        next();
    }
}
