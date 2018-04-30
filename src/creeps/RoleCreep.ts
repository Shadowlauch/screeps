import {CreepMemory} from '../memory/CreepMemory';
import {RoomManager} from '../RoomManager';

export class RoleCreep {
  constructor(public creep: Creep, protected roomManager: RoomManager, protected role?: string) {
  }

  public run(energyLock: boolean): void {
    throw new Error('The parent run method should not be called');
  }

  public getRole(): string {
    return this.role || 'test';
  }

  get memory(): CreepMemory {
    return this.creep.memory as CreepMemory;
  }

  public static needCreep(roomManager: RoomManager): boolean {
    return true;
  }
}
