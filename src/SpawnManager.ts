import {RoleCreep} from './creeps/RoleCreep';
import {Harvester} from './creeps/Harvester';
import {CreepMemory} from './memory/CreepMemory';

export class SpawnManager {
  private creeps: RoleCreep[] = [];

  private readonly MAX_COUNTS: any = {
    harvester: 5
  };

  constructor(private room: Room) {
  }

  public run() {
    this.createCreeps();
  }

  private createCreeps() {
    for (const creep of this.room.find(FIND_MY_CREEPS)) {
      this.creeps.push(this.getRoleCreep((creep.memory as CreepMemory).role, creep));
    }

    for (const type in this.MAX_COUNTS) {
      if (this.creeps.filter((creep) => creep.getRole() === type).length < this.MAX_COUNTS[type]) {
        try {
          const creep = this.getRoleCreep(type);
        } catch (e) {
          console.log(e.toLocaleString());
          continue;
        }
        this.creeps.push();
      }
    }
    for (const creep of this.creeps) {
      creep.run();
    }
  }

  private getRoleCreep(role: string, creep?: Creep): RoleCreep {
    const c = creep ? creep : null;
    switch (role) {
      case 'harvester':
        return new Harvester(this.room, c);
      default:
        return new Harvester(this.room, c);
    }
  }
}
