import {RoleCreep} from './RoleCreep';

export class Upgrader extends RoleCreep {
  constructor(creep: Creep) {
    console.log("zesz");
    super('upgrader', creep);
  }

  public run(): void {
    if (this.memory.working && this.creep.carry.energy === 0) {
      this.memory.working = false;
      this.creep.say('🔄 harvest');
    }
    if (!this.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
      this.memory.working = true;
      this.creep.say('⚡ upgrade');
    }

    if (this.memory.working) {
      if (this.creep.room.controller && this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 10});
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN) && structure.energy > 0;
        }
      });
      if (targets.length > 0) {
        if (!Memory.spawnLock) {
          const withdraw = this.creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE;

          if (withdraw) {
            this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
          }
        } else {
          this.creep.moveTo(28, 34, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }
}
