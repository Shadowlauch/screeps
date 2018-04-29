export interface RoleDefinition {
  role: string;
  bodyParts: BodyPartConstant[];
  maxAmount: number;
  critical?: boolean;
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
        critical: true
      },
      {
        role: 'upgrader',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        maxAmount: 2
      },
      {
        role: 'builder',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
        maxAmount: 2
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
        critical: true
      },
      {
        role: 'harvester',
        bodyParts: [WORK, WORK, WORK, WORK, CARRY, MOVE],
        maxAmount: 4,
        critical: true
      },
      {
        role: 'upgrader',
        bodyParts: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxAmount: 2
      },
      {
        role: 'repairer',
        bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        maxAmount: 1,
        critical: true
      },
      {
        role: 'builder',
        bodyParts: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        maxAmount: 2
      }
    ]
  }
];
