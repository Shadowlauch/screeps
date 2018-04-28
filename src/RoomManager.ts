import {CreepManager} from './CreepManager';

export class RoomManager {
  private creepManager: CreepManager;

  constructor(private name: string, private room: Room) {
    this.creepManager = new CreepManager(this.room);
  }

  public run() {
    this.creepManager.run();
  }
}
