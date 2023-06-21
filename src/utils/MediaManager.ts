import ImageKit from "imagekit";

export default class MediaManager {
  private static imagekit = new ImageKit({
    publicKey: "public_ezsqfPMMvU+6dKNB1MHpZQbjEiY=",
    privateKey: "private_lX0IVpWziNG3bGoblqm5V3248Gk=",
    urlEndpoint: "https://ik.imagekit.io/z6k3ktb71",
  });
  public static async uploadFile(
    file: Express.Multer.File
  ): Promise<{ name: string; fileId: string }> {
    try {
      // var imagekit = new ImageKit({
      //   publicKey: "public_ezsqfPMMvU+6dKNB1MHpZQbjEiY=",
      //   privateKey: "private_lX0IVpWziNG3bGoblqm5V3248Gk=",
      //   urlEndpoint: "https://ik.imagekit.io/z6k3ktb71",
      // });
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
      console.log("media manager upload ee", error);
      throw error;
    }
  }
  public static async deletefiles(file: {
    name: string;
    fileId: string;
  }): Promise<Boolean> {
    try {
      // var imagekit = new ImageKit({
      //   publicKey: "public_ezsqfPMMvU+6dKNB1MHpZQbjEiY=",
      //   privateKey: "private_lX0IVpWziNG3bGoblqm5V3248Gk=",
      //   urlEndpoint: "https://ik.imagekit.io/z6k3ktb71",
      // });
      await this.imagekit.deleteFile(file.fileId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
