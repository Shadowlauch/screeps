import {CreepManager} from './CreepManager';

export class RoomManager {
  private creepManager: CreepManager;

  constructor(private name: string, public room: Room) {
    this.creepManager = new CreepManager(this);
  }

  public run() {
    this.creepManager.run();
  }

  public get memory(): any {
    return this.room.memory as any;
  }
}
