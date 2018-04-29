import {RoleCreep} from './RoleCreep';
import {RoomManager} from '../RoomManager';

export class Harvester extends RoleCreep {
  constructor(creep: Creep) {
    super('harvester', creep);
  }

  public run(): void {
    if (!this.memory.working && this.creep.carry.energy === 0) {
      this.memory.working = true;
      this.creep.say('🔄 harvest');
    }
    if (this.memory.working && this.creep.carry.energy === this.creep.carryCapacity) {
      this.memory.working = false;
      this.creep.say('⚡ put away');
    }

    if (this.memory.working) {
      if (!this.memory.sourceId) {
        this.memory.sourceId = this.creep.pos.findClosestByPath(FIND_SOURCES).id;
      }

      const source = Game.getObjectById<Source>(this.memory.sourceId);

      if (source && this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 2});
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 2});
        }
      }
    }
  }

  public static create(roomManager: RoomManager, creep: Creep): Harvester {
    const harvester = new Harvester(creep);

    if (harvester.memory.sourceId) {
      return harvester;
    }

    const sources = roomManager.sources;
    const roleConfig = roomManager.stage.roles.find((r) => r.role === 'harvester');

    if (!roleConfig) {
      throw new Error('Role harvester not found');
    }
    const creepsPerSource = Math.ceil(roleConfig.maxAmount / sources.length);
    for (const source of sources) {
      if (source.countHarvesters() < creepsPerSource) {
        harvester.memory.sourceId = source.sourceId;
        break;
      }
    }

    return harvester;
  }
}
