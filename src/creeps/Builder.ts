import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';
import {Upgrader} from './Upgrader';

export class Builder extends RoleCreep {
  constructor(creep: Creep, roomManager: RoomManager) {
    super(creep, roomManager, 'builder');
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

          const upgrader = new Upgrader(this.creep, this.roomManager);
          upgrader.run(energyLock);
          //this.creep.moveTo(20, 15, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  }

  public static needCreep(roomManager: RoomManager): boolean {
    const target = roomManager.room.find(FIND_CONSTRUCTION_SITES);
    return target.length > 0;
  }
}
