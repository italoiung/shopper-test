import path from 'path';
import { writeFile } from 'fs/promises';

const PUBLIC_TEMP_DIR = path.resolve('temp');

type ImageData = {
  mimeType: `image/${string}`;
  ext: string;
  encoded: string;
} | null;

const extractBase64 = (base64: string) =>
  (base64.match(/^data:(?<mimeType>\w*\/(?<ext>\w*));base64,(?<encoded>.*)$/)
    ?.groups || null) as ImageData;

export const filesystemHandler = async (base64: string, filename: string) => {
  const imageData = extractBase64(base64);

  if (imageData) {
    try {
      await writeFile(
        `${PUBLIC_TEMP_DIR}/${filename}`,
        Buffer.from(imageData.encoded, 'base64'),
      );
    } catch (e) {
      console.error(e);
    }
  }

  return imageData;
};
