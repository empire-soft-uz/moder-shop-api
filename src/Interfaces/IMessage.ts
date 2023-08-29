export default interface IMessage {
  id?: string;
  sender: string;
  reciever: string;
  message: string;
  chat: string;
  file: { buffer: Buffer; type: string; originalName: string };
  viewed:boolean
}
