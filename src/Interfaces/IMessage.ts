export default interface IMessage {
  id?: string;
  sender: string;
  reciever: IUser;
  message: string;
  chat: string;
  file: { buffer: Buffer; type: string; originalName: string };
}
