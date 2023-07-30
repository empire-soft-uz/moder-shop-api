import { Model, Document } from "mongoose";
interface admin {
    email: string;
    password: string;
    vendorId: string;
}
interface AdminDoc extends Document {
    email: string;
    password: string;
    vendorId: string;
    super: boolean;
}
interface AdminModel extends Model<AdminDoc> {
    build(attrs: admin): AdminDoc;
}
declare const Admin: AdminModel;
export default Admin;
