type hash = {
    buff: string;
    salt: string;
};
export default class Password {
    private static asyncScrypt;
    static hashPassword(password: string): Promise<hash>;
    static compare(password: string, hash: hash): Promise<boolean>;
}
export {};
