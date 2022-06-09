import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { Organization } from '@/organization/entity/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { AcpPolicy } from '@acp/policy';
import { AcpRole } from '@acp/role';
import { AcpSubject } from '@acp/subject';
import { AcpAbility } from '@acp/ability';
import { AuthService } from '@/auth/service/auth.service';
import { superSeedData } from './data';

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
      const { salt, passwordExpired, passwordHash } =
        await this.authService.createPassword(
          process.env.AUTH_SUPER_ADMIN_INITIAL_PASS,
        );
      const organizationOwner = this.userRepository.create({
        ...superSeedData.owner,
        mobileNumber: '+972546000000',
        password: passwordHash,
        salt,
        passwordExpired,
      });

      const organizationRoles = superSeedData.roles.map((role) => {
        const rolePolicies = role.policies.map((policy) => {
          const policySubjects = policy.subjects.map((subject) => {
            debugger;
            const subjectAbilities = subject.abilities.map((ability) => {
              return this.abilityRepository.create({
                type: ability.type,
                action: ability.action,
              });
            });
            return this.subjectRepository.create({
              type: subject.type,
              sensitivityLevel: subject.sensitivityLevel,
              abilities: subjectAbilities,
            });
          });
          return this.policyRepository.create({
            subjects: policySubjects,
            sensitivityLevel: policy.sensitivityLevel,
          });
        });
        return this.roleRepository.create({
          name: role.name,
          isActive: true,
          policies: rolePolicies,
        });
      });

      const systemOrganization = this.organizationRepository.create({
        ...superSeedData.organization,
        owner: organizationOwner,
        roles: organizationRoles,
      });
      this.organizationRepository.save(systemOrganization);

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
