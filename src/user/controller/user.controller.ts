import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Services
import { AclRoleService } from '@acl/role/service';
import { UserService } from '../service';
import { HelperDateService } from '@/utils/helper/service';
//

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: AclRoleService,
    private readonly helperDateService: HelperDateService,
  ) {}
}
