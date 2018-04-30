import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';

export class Upgrader extends RoleCreep {
  constructor(creep: Creep, roomManager: RoomManager) {
    super(creep, roomManager, 'upgrader');
  }

  public run(energyLock: boolean): void {
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
      const target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN) && structure.energy > 0;
        }
      });
      if (target) {
        if (!energyLock) {
          const withdraw = this.creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE;

          if (withdraw) {
            this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
          }
        } else {
          this.creep.moveTo(28, 34, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }
}
