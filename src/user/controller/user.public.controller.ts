import { Controller } from '@nestjs/common';
import { AwsS3Service } from 'src/aws/service/aws.s3.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { UserService } from '../service/user.service';

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
}
