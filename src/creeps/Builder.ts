import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';

export class Builder extends RoleCreep {
  constructor(creep: Creep) {
    super(creep, 'builder');
  }

  public run(energyLock: boolean): void {
    if (this.memory.working && this.creep.carry.energy === 0) {
      this.memory.working = false;
      this.creep.say('🔄 harvest');
    }
    if (!this.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
      this.memory.working = true;
      this.creep.say('🚧 build');
    }

    if (this.memory.working) {
      const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN) && structure.energy > 0;
        }
      });
      if (targets.length > 0) {
        if (!energyLock) {
          const withdraw = this.creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE;

          if (withdraw) {
            this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
          }
        } else {
          this.creep.moveTo(20, 15, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }

  public static needCreep(roomManager: RoomManager): boolean {
    const target = roomManager.room.find(FIND_CONSTRUCTION_SITES);
    return target.length > 0;
  }
}
