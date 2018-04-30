import {RoomManager} from './RoomManager';
import {RoleCreep} from './creeps/RoleCreep';

export class SourceWrapper {
  private container: StructureContainer;

  constructor(private source: Source, private roomManager: RoomManager) {
    this.container = this.source.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_CONTAINER);
      }
    });
  }

  public countHarvesters(): number {
    return _.sum(this.roomManager.creepManager.creeps, (creep: RoleCreep) =>
      (creep.memory.sourceId === this.source.id && creep.memory.role === 'harvester') ? 1 : 0);
  }

  public countMovers(): number {
    return _.sum(this.roomManager.creepManager.creeps, (creep: RoleCreep) =>
      (this.container && creep.memory.containerId === this.container.id && creep.memory.role === 'mover') ? 1 : 0);
  }

  public get sourceId(): string {
    return this.source.id;
  }

  public get containerId(): string {
    return this.container ? this.container.id : '';
  }
}
