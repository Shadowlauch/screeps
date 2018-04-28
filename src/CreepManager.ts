import {RoleCreep} from './creeps/RoleCreep';
import {Harvester} from './creeps/Harvester';
import {CreepMemory} from './memory/CreepMemory';
import {Upgrader} from './creeps/Upgrader';

export class CreepManager {
  private creeps: RoleCreep[] = [];

  private readonly roles: any = {
    harvester: {
      bodyParts: [WORK, CARRY, MOVE],
      maxAmount: 6
    },
    upgrader: {
      bodyParts: [WORK, WORK, CARRY, MOVE],
      maxAmount: 1
    }
  };

  constructor(private room: Room) {
  }

  public run() {
    this.createCreeps();
  }

  private createCreeps() {
    for (const creep of this.room.find(FIND_MY_CREEPS)) {
      this.creeps.push(this.getRoleCreep(creep));
    }

    this.spawnCreeps();

    for (const creep of this.creeps) {
      creep.run();
    }
  }

  private getRoleCreep(creep: Creep): RoleCreep {
    switch ((creep.memory as CreepMemory).role) {
      case 'harvester':
        return new Harvester(creep);
      case 'upgrader':
        return new Upgrader(creep);
      default:
        throw Error('Role not found');
    }
  }

  private spawnCreeps() {
    const spawn = Game.spawns.Spawn1;

    for (const role in this.roles) {
      const roleO = this.roles[role];
      if (this.creeps.filter((creep) => creep.getRole() === role).length < roleO.maxAmount
        && this.bodyPartsBuildCost(roleO.bodyParts) <= spawn.energy) {

        const name = this.room.name + '_' + role + '_' + Memory.uuid++;
        const status = spawn.spawnCreep(this.roles[role].bodyParts, name, {memory: {role: role as string}});

        if (status === OK) {
          const creep = Game.creeps[name];
          this.creeps.push(this.getRoleCreep(creep));
        } else {
          console.log(status.toLocaleString());
        }
      }
    }
  }

  private bodyPartsBuildCost(bodyParts: BodyPartConstant): number {
    let cost = 0;
    for (const bodyPart of bodyParts) {
      switch (bodyPart) {
        case MOVE:
        case CARRY:
          cost += 50;
          break;
        case WORK:
          cost += 100;
          break;
        case ATTACK:
          cost += 80;
          break;
        case RANGED_ATTACK:
          cost += 150;
          break;
        case HEAL:
          cost += 250;
          break;
        case TOUGH:
          cost += 10;
          break;
        case CLAIM:
          cost += 600;
          break;
        default:
          cost += 0;
      }
    }

    return cost;
  }
}
