import {CreepManager} from './CreepManager';
import {StageDefiniton, STAGES} from './stage.config';
import {SourceWrapper} from './SourceWrapper';

export class RoomManager {
  public creepManager: CreepManager;
  public maxEnergy = 0;
  public roomStage = 1;

  constructor(private name: string, public room: Room) {
    this.creepManager = new CreepManager(this);
  }

  public run() {
    this.checkRoomStage();
    this.getMaxSpawnEnergy();
    this.creepManager.run();
  }

  public get memory(): any {
    return this.room.memory as any;
  }

  public get sources(): SourceWrapper[] {
    const sourceWrappers: SourceWrapper[] = [];

    const sources = this.room.find<FIND_SOURCES>(FIND_SOURCES);
    for (const source of sources) {
      sourceWrappers.push(new SourceWrapper(source, this));
    }

    return sourceWrappers;
  }

  public getSourceById(id: string) {
    return new SourceWrapper(Game.getObjectById(id) as Source, this);
  }

  public get stage(): StageDefiniton {
    return STAGES[this.roomStage - 1];
  }

  private checkRoomStage() {
    if (!this.memory.roomStage) {
      this.memory.roomStage = 1;
    }

    this.roomStage = this.memory.roomStage;
  }

  private getMaxSpawnEnergy() {
    if (this.memory.maxEnergy && Game.time % 5 !== 0) {
      this.maxEnergy = this.memory.maxEnergy;
      return;
    }

    const targets = this.room.find<StructureExtension | StructureSpawn>(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN);
      }
    });

    let maxEnergy = 0;
    for (const target of targets) {
      maxEnergy += target.energyCapacity;
    }

    this.memory.maxEnergy = this.maxEnergy = maxEnergy;
  }
}
