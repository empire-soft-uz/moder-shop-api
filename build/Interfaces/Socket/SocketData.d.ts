import IAdmin from "../IAdmin";
import IUser from "../IUser";
export default interface SocketData {
    user: IUser | IAdmin;
}
