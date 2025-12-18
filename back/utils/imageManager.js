import path from "path";
import fs from "fs";
import sharp from "sharp";

export const saveImage = (imageBuffer, imageName, destFolder) => {
  const folderPath = path.resolve(destFolder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `${imageName}.jpeg`);

  return sharp(imageBuffer)
    .resize({
      fit: "inside",
      width: 300,
      height: 300,
    })
    .jpeg()
    .toFile(filePath);
};

export const deleteImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve("upload", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        reject(new Error("Error deleting image: " + err.message));
      } else {
        resolve("Image deleted successfully");
      }
    });
  });
};
