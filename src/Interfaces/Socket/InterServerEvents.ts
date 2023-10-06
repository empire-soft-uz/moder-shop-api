import IMessage from "../IMessage";

export default interface InterServerEvents {
  getViewedMsg: (msg: IMessage) => void;

}
