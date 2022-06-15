import { Command } from 'nestjs-command';
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

@Injectable()
export class SuperSeed {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly acpRoleService: AcpRoleService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,

    private readonly debuggerService: DebuggerService,
    private readonly authService: AuthService,
  ) {}

  @Command({
    command: 'insert:super',
    describe: 'insert super data',
  })
  async insert(): Promise<void> {
    try {
      const { salt, passwordExpired, passwordHash } =
        await this.authService.createPassword(
          process.env.AUTH_SUPER_ADMIN_INITIAL_PASS,
        );
      // const superOwner = this.userRepository.create({
      //   ...superSeedData.owner,
      //   mobileNumber: '+972546000000',
      //   password: passwordHash,
      //   salt,
      //   passwordExpired,
      // });

      // const systemRoles = superSeedData.roles.map((role) => {
      //   const { policy } = role;
      //   const policySubjects = policy.subjects.map((subject) => {
      //     const subjectAbilities = subject.abilities.map((ability) => {
      //       return this.abilityRepository.create({
      //         type: ability.type,
      //         action: ability.action,
      //       });
      //     });
      //     return this.subjectRepository.create({
      //       type: subject.type,
      //       sensitivityLevel: subject.sensitivityLevel,
      //       abilities: subjectAbilities,
      //     });
      //   });

      //   const rolePolicy = this.policyRepository.create({
      //     subjects: policySubjects,
      //     sensitivityLevel: policy.sensitivityLevel,
      //   });

      //   return this.roleRepository.create({
      //     name: role.name,
      //     isActive: true,
      //     policy: rolePolicy,
      //   });
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
