import ImageKit from "imagekit";

export default class MediaManager {
  private static imagekit = new ImageKit({
    //@ts-ignore
    publicKey: process.env.IPUBK,
    //@ts-ignore
    privateKey: process.env.IPRK,
    //@ts-ignore
    urlEndpoint: process.env.IURL,
  });
  public static async uploadFile(
    file: Express.Multer.File
  ): Promise<{ name: string; fileId: string }> {
    try {
      const res = await this.imagekit.upload({
        file: file.buffer.toString("base64"), //required
        fileName: file.originalname, //required
        useUniqueFileName: true,
        extensions: [
          {
            name: "google-auto-tagging",
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });

      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public static async deletefiles(file: {
    name: string;
    fileId: string;
  }): Promise<Boolean> {
    try {
      await this.imagekit.deleteFile(file.fileId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
