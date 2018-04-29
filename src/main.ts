import {ErrorMapper} from 'utils/ErrorMapper';
import {RoomManager} from './RoomManager';

console.log('Deployed');
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  if (!Memory.uuid) {
    Memory.uuid = 0;
  }
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];

    const roomManager = new RoomManager(roomName, room);
    roomManager.run();
  }
});
