import {CreepMemory} from '../memory/CreepMemory';

export class RoleCreep {
  constructor(protected role: string, public creep: Creep) {
  }

  public run(energyLock: boolean): void {
    throw new Error('The parent run method should not be called');
  }

  public getRole(): string {
    return this.role;
  }

  get memory(): CreepMemory {
    return this.creep.memory as CreepMemory;
  }
}
