import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';

export class Repairer extends RoleCreep {
  constructor(creep: Creep) {
    super(creep, 'repairer');
  }

  public run(energyLock: boolean): void {
    if (this.memory.working && this.creep.carry.energy === 0) {
      this.memory.working = false;
      this.creep.say('🔄 harvest');
    }
    if (!this.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
      this.memory.working = true;
      this.creep.say('🚧 repair');
    }

    if (this.memory.working) {
      const target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL;
        }
      });
      if (target != null) {
        if (this.creep.repair(target) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
        }
      } else {
        this.creep.moveTo(14, 34, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN) && structure.energy > 0;
        }
      });

      if (targets.length > 0) {
        if (this.creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
        }
      }
    }
  }

  public static needCreep(roomManager: RoomManager): boolean {
    const target = roomManager.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL;
      }
    });
    return target.length > 0;
  }
}
