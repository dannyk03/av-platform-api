import { Command } from 'nestjs-command';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { AuthService } from '@/auth/service/auth.service';
import { superSeedData } from './data';
import { OrganizationService } from '@/organization';
import { UserService } from '@/user';
import { AcpPolicyService } from '@acp/policy';
import { AcpSubjectService } from '@acp/subject';
import { AcpAbilityService } from '@acp/ability';
import { AcpRoleService, SystemRoleEnum } from '@acp/role';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SuperSeed {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly acpRoleService: AcpRoleService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,

    private readonly authService: AuthService,
    @InjectDataSource('default')
    private dataSource: DataSource,
    private readonly debuggerService: DebuggerService, // private readonly configService: ConfigService,
  ) {}

  @Command({
    command: 'insert:super',
    describe: 'insert super data',
  })
  async insert(): Promise<void> {
    try {
      // const ds = this.configService.get('database.default');
      // console.log(ds.options);
      // const systemRoles = superSeedData.roles.map((role) => {
      //   const { policy } = role;
      //   const policySubjects = policy.subjects.map((subject) => {
      //     const subjectAbilities = subject.abilities.map((ability) => {
      //       return this.acpAbilityService.create({
      //         type: ability.type,
      //         action: ability.action,
      //       });
      //     });
      //     return this.acpSubjectService.create({
      //       type: subject.type,
      //       sensitivityLevel: subject.sensitivityLevel,
      //       abilities: subjectAbilities,
      //     });
      //   });

      //   const rolePolicy = this.acpPolicyService.create({
      //     subjects: policySubjects,
      //     sensitivityLevel: policy.sensitivityLevel,
      //   });

      //   return this.acpRoleService.create({
      //     name: role.name,
      //     isActive: true,
      //     policy: rolePolicy,
      //   });
      // });

      // const { salt, passwordExpired, passwordHash } =
      //   await this.authService.createPassword(
      //     process.env.AUTH_SUPER_ADMIN_INITIAL_PASS,
      //   );

      // const superOwner = this.userService.create({
      //   ...superSeedData.owner,
      //   mobileNumber: '+972546000000',
      //   password: passwordHash,
      //   salt,
      //   passwordExpired,
      // });

      // superOwner.role = [
      //   systemRoles.find((role) => role.name == SystemRoleEnum.SuperAdmin),
      // ];

      // const systemOrganization = this.organizationRepository.create({
      //   ...superSeedData.organization,
      //   // owner: superOwner,
      //   // users: [superOwner],
      //   // roles: systemRoles,
      // });
      // await this.organizationRepository.save(systemOrganization);

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
