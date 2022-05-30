import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/service/user.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserSeed {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'insert:user',
    describe: 'insert users',
  })
  async insert(): Promise<void> {
    try {
      const password = await this.authService.createPassword('aaAA@@123444');

      await this.userService.create({
        firstName: 'admin',
        lastName: 'test',
        email: 'admin@mail.com',
        password: password.passwordHash,
        passwordExpired: password.passwordExpired,
        salt: password.salt,
      });

      this.debuggerService.debug('Insert User Succeed', 'UserSeed', 'insert');
    } catch (e) {
      this.debuggerService.error(e.message, 'UserSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:user',
    describe: 'remove users',
  })
  async remove(): Promise<void> {
    try {
      //   await this.userBulkService.deleteMany({});

      this.debuggerService.debug('Remove User Succeed', 'UserSeed', 'remove');
    } catch (e) {
      this.debuggerService.error(e.message, 'UserSeed', 'remove');
    }
  }
}
