import IChat from "./IChat";
import { IMessage } from "./IMessage";
import IUser from "./IUser";

export default interface ServerToClientEvents {
  //newUser: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  chats: (data: IChat[]) => void;
  activeUsers: (users: IUser[]) => void;
  sendMessage: (msg: IMessage) => void;
}
