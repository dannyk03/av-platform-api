import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DebuggerService } from '@/debugger';
import { AcpPolicyService } from '@acp/policy';
import { AcpSubjectService } from '@acp/subject';
import { AcpAbilityService } from '@acp/ability';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConnectionNames } from '../database.constant';
// import { systemSeedData } from './data';
import { AcpRolePresetService } from '@/access-control-policy/role/service/acp-role-preset.service';

@Injectable()
export class RolePresetsSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly acpRolePresetService: AcpRolePresetService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,
    private readonly debuggerService: DebuggerService,
  ) {}

  @Command({
    command: 'insert:role-presets',
    describe: 'insert role presets data',
  })
  async insert(): Promise<void> {
    try {
      // await this.defaultDataSource.transaction(
      //   'SERIALIZABLE',
      //   async (transactionalEntityManager) => {
      //     try {
      //       const rolePresets = await Promise.all(
      //         systemSeedData.roles.map(async (role) => {
      //           const { policy } = role;
      //           const policySubjects = await Promise.all(
      //             policy.subjects.map(async (subject) => {
      //               const subjectAbilities = await Promise.all(
      //                 subject.abilities.map(async (ability) => {
      //                   const abilityEntity = this.acpAbilityService.create({
      //                     type: ability.type,
      //                     actions: ability.actions,
      //                   });

      //                   return transactionalEntityManager.save(abilityEntity);
      //                 }),
      //               );
      //               const subjectEntity = this.acpSubjectService.create({
      //                 type: subject.type,
      //                 sensitivityLevel: subject.sensitivityLevel,
      //                 abilities: subjectAbilities,
      //               });

      //               return transactionalEntityManager.save(subjectEntity);
      //             }),
      //           );
      //           const policyEntity = this.acpPolicyService.create({
      //             subjects: policySubjects,
      //             sensitivityLevel: policy.sensitivityLevel,
      //           });

      //           await transactionalEntityManager.save(policyEntity);
      //           const roleEntity = this.acpRolePresetService.create({
      //             name: role.name,
      //             policy: policyEntity,
      //           });

      //           return transactionalEntityManager.save(roleEntity);
      //         }),
      //       );

      //       await transactionalEntityManager.save(rolePresets);

      //       this.debuggerService.debug(
      //         'Insert Role Presets Succeed',
      //         'RolePresetsSeed',
      //         'insert',
      //       );
      //     } catch (err) {
      //       this.debuggerService.error(
      //         err.message,
      //         'RolePresetsSeed',
      //         'insert seed transaction',
      //       );
      //     }
      //   },
      // );

      this.debuggerService.debug(
        'Insert Role Presets Succeed',
        'RolePresetsSeed',
        'insert',
      );
    } catch (err) {
      this.debuggerService.error(err.message, 'SystemSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:role-presets',
    describe: 'remove role presets data',
  })
  async remove(): Promise<void> {
    try {
      throw new Error('Not Implemented remove:role-presets');
      this.debuggerService.debug(
        'Remove Role Presets Succeed',
        'RolePresetsSeed',
        'remove',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'RolePresetsSeed', 'remove');
    }
  }
}
