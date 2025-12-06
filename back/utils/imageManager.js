import path from "path";
import fs from "fs";
import sharp from "sharp";

export const saveImage = (imageBuffer, imageName, destFolder) => {
  const folderPath = path.resolve(destFolder);

  return sharp(imageBuffer)
    .jpeg()
    .resize({
      fit: "inside",
      width: 300,
      height: 300,
    })
    .toFile(`${folderPath}/${imageName}.jpeg`);
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
