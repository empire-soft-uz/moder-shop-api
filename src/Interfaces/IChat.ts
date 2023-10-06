import IAdmin from "./IAdmin";
import IUser from "./IUser";
import IProduct from "./Product/IProduct";

export default interface IChat {
  user: IUser;
  admin: IAdmin;
  id: string;
  product:IProduct  
}
