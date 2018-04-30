import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';

export class Mover extends RoleCreep {
  constructor(creep: Creep, roomManager: RoomManager) {
    super(creep, roomManager, 'mover');
  }

  public run(): void {
    if (this.memory.working && this.creep.carry.energy === 0) {
      this.memory.working = false;
      this.creep.say('🔄 harvest');
    }
    if (!this.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
      this.memory.working = true;
      this.creep.say('⚡ put away');
    }

    if (!this.memory.working) {
      const container = Game.getObjectById(this.memory.containerId) as StructureContainer;

      if (container && this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          if ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN
            || structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) {
            return true;
          } else if (structure.structureType === STRUCTURE_STORAGE
            && structure.store[RESOURCE_ENERGY] < structure.storeCapacity) {
            return true;
          } else {
            return false;
          }
        }
      });
      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
        }
      }
    }
  }

  public static create(roomManager: RoomManager, creep: Creep): Mover {
    const mover = new Mover(creep, roomManager);

    if (mover.memory.containerId) {
      return mover;
    }

    const sources = roomManager.sources;
    const roleConfig = roomManager.stage.roles.find((r) => r.role === 'mover');

    if (!roleConfig) {
      throw new Error('Role mover not found');
    }
    const creepsPerSource = Math.ceil(roleConfig.maxAmount / sources.length);
    for (const source of sources) {
      if (source.containerId !== '' && source.countMovers() < creepsPerSource) {
        mover.memory.sourceId = source.sourceId;
        mover.memory.containerId = source.containerId;
        break;
      }
    }

    return mover;
  }
}
