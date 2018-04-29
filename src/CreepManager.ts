import {RoleCreep} from './creeps/RoleCreep';
import {Harvester} from './creeps/Harvester';
import {CreepMemory} from './memory/CreepMemory';
import {Upgrader} from './creeps/Upgrader';
import {RoomManager} from './RoomManager';
import {Builder} from './creeps/Builder';

export class CreepManager {
  private creeps: RoleCreep[] = [];
  private room: Room;

  private readonly roles: Array<{
    role: string,
    bodyParts: BodyPartConstant[],
    maxAmount: number,
    critical?: boolean
  }> = [
    {
      role: 'harvester',
      bodyParts: [WORK, CARRY, MOVE],
      maxAmount: 6,
      critical: true
    },
    {
      role: 'upgrader',
      bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
      maxAmount: 2
    },
    {
      role: 'builder',
      bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
      maxAmount: 2
    }
  ];

  constructor(private roomManager: RoomManager) {
    this.room = this.roomManager.room;
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
      creep.run(this.roomManager.memory.energyLock);
    }
  }

  private getRoleCreep(creep: Creep): RoleCreep {
    switch ((creep.memory as CreepMemory).role) {
      case 'harvester':
        return new Harvester(creep);
      case 'upgrader':
        return new Upgrader(creep);
      case 'builder':
        return new Builder(creep);
      default:
        throw Error('Role not found');
    }
  }

  private spawnCreeps() {
    const spawn = Game.spawns.Spawn1;

    for (const role of this.roles) {
      if (this.creeps.filter((creep) => creep.getRole() === role.role).length < role.maxAmount) {

        if (role.critical) {
          this.roomManager.memory.energyLock = true;
        }

        if (this.bodyPartsBuildCost(role.bodyParts) <= spawn.energy) {
          const name = this.room.name + '_' + role.role + '_' + Memory.uuid++;
          const status = spawn.spawnCreep(role.bodyParts, name, {memory: {role: role.role}});

          if (status === OK) {
            const creep = Game.creeps[name];
            this.creeps.push(this.getRoleCreep(creep));

            if (role.critical) {
              this.roomManager.memory.energyLock = false;
            }
            return;
          } else {
            console.log(status.toLocaleString());
          }
        }
      }
    }
  }

  private bodyPartsBuildCost(bodyParts: BodyPartConstant[]): number {
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
