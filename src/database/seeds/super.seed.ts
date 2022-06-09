import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { Organization } from '@/organization/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { AcpPolicy } from '@acp/policy';
import { AcpRole } from '@acp/role';
import { AcpSubject } from '@acp/subject';
import { AcpAbility } from '@acp/ability';
import { AuthService } from '@/auth/service/auth.service';

@Injectable()
export class SuperSeed {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Organization)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private roleRepository: Repository<AcpRole>,
    @InjectRepository(Organization)
    private policyRepository: Repository<AcpPolicy>,
    @InjectRepository(Organization)
    private subjectRepository: Repository<AcpSubject>,
    @InjectRepository(Organization)
    private abilityRepository: Repository<AcpAbility>,
    private readonly debuggerService: DebuggerService,
    private readonly authService: AuthService,
  ) {}

  @Command({
    command: 'insert:super',
    describe: 'insert super data',
  })
  async insert(): Promise<void> {
    try {
      const systemOrganization = this.organizationRepository.create({
        name: 'system',
      });

      //   systemOrganization.roles = "fg"

      this.debuggerService.debug('Insert Super Succeed', 'SuperSeed', 'insert');
    } catch (e) {
      this.debuggerService.error(e.message, 'SuperSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:super',
    describe: 'remove super data',
  })
  async remove(): Promise<void> {
    try {
      //   await this.userBulkService.deleteMany({});

      this.debuggerService.debug('Remove Super Succeed', 'SuperSeed', 'remove');
    } catch (e) {
      this.debuggerService.error(e.message, 'SuperSeed', 'remove');
    }
  }
}
