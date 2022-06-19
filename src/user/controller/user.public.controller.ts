import { Controller } from '@nestjs/common';
import { AwsS3Service } from '@/aws';
import { DebuggerService } from '@/debugger';
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
