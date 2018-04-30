import {RoleCreep} from './creeps/RoleCreep';
import {Harvester} from './creeps/Harvester';
import {Upgrader} from './creeps/Upgrader';
import {Builder} from './creeps/Builder';
import {Repairer} from './creeps/Repairer';

export interface RoleDefinition {
  role: string;
  bodyParts: BodyPartConstant[];
  maxAmount: number;
  critical?: boolean;
  class: typeof RoleCreep;
}

export interface StageDefiniton {
  stage: number;
  roles: RoleDefinition[];
}

export const STAGES: StageDefiniton[] = [
  {
    stage: 1,
    roles: [
      {
        role: 'harvester',
        bodyParts: [WORK, CARRY, MOVE],
        maxAmount: 6,
        critical: true,
        class: Harvester
      },
      {
        role: 'upgrader',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        maxAmount: 2,
        class: Upgrader
      },
      {
        role: 'builder',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        maxAmount: 2,
        class: Builder
      },
      {
        role: 'repairer',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        maxAmount: 2,
        class: Repairer
      }
    ]
  },
  {
    stage: 2,
    roles: [
      {
        role: 'mover',
        bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxAmount: 4,
        critical: true,
        class: RoleCreep
      },
      {
        role: 'harvester',
        bodyParts: [WORK, WORK, WORK, WORK, CARRY, MOVE],
        maxAmount: 4,
        critical: true,
        class: Harvester
      },
      {
        role: 'upgrader',
        bodyParts: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxAmount: 2,
        class: Upgrader
      },
      {
        role: 'repairer',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxAmount: 1,
        critical: true,
        class: Repairer
      },
      {
        role: 'builder',
        bodyParts: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        maxAmount: 2,
        class: Builder
      }
    ]
  }
];
