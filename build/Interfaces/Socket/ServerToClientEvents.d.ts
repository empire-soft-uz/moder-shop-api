import IAdmin from "../IAdmin";
import IChat from "../IChat";
import IMessage from "../IMessage";
import IUser from "../IUser";
export default interface ServerToClientEvents {
    chats: (data: IChat[]) => void;
    activeUsers: (users: IUser[]) => void;
    sendMessage: (msg: IMessage) => void;
    newChatAdminNotification: (chat: IChat) => void;
    getViewedMsg: (msg: IMessage) => void;
    userDisconnected: (user: IUser | IAdmin) => void;
}
