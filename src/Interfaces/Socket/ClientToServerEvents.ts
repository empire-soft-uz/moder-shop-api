import IChat from "./IChat";
import { IMessage } from "./IMessage";
import IUser from "./IUser";

export default interface ClientToServerEvents {
  newUser: (user: IUser) => void;
  recieveMsg: (msg: IMessage) => void;
  chatSelected: (msg: IChat) => void;
  getChatMessages: (chat: IUser) => void;
}
