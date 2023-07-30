/// <reference types="multer" />
export default class MediaManager {
    private static imagekit;
    static uploadFile(file: Express.Multer.File): Promise<{
        name: string;
        fileId: string;
    }>;
    static deletefiles(file: {
        name: string;
        fileId: string;
    }): Promise<Boolean>;
}
