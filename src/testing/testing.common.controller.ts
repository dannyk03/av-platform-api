import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiKey, AuthExcludeApiKey } from '@/auth/auth.decorator';
import { IAuthApiPayload } from '@/auth/auth.interface';
import { UserAgent } from '@/utils/request/request.decorator';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { IResult } from 'ua-parser-js';

@Controller({
    version: VERSION_NEUTRAL,
})
export class TestingCommonController {
    @Response('test.hello')
    @AuthExcludeApiKey()
    @Get('/hello')
    async hello(
        @UserAgent() userAgent: IResult,
        @ApiKey() apiKey: IAuthApiPayload,
    ): Promise<IResponse> {
        return { userAgent, apiKey };
    }
}
