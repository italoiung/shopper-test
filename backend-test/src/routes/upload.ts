import type { RequestHandler } from 'express';
import path from 'path';
import { writeFile } from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../prisma';

const PUBLIC_TEMP_DIR = path.resolve('temp');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

type ReqBody = {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
};

type ImageData = {
  mimeType: `image/${string}`;
  ext: string;
  encoded: string;
} | null;

const handleBase64 = (base64: string) =>
  (base64.match(/^data:(?<mimeType>\w*\/(?<ext>\w*));base64,(?<encoded>.*)/)
    ?.groups || null) as ImageData;

export const upload: RequestHandler<any, any, ReqBody> = async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const imageData = handleBase64(image);

  if (!imageData) return;

  let value: number = 0;

  try {
    const { response } = await model.generateContent([
      'Transcribe only the numbers on this image',
      {
        inlineData: {
          data: imageData.encoded,
          mimeType: imageData.mimeType,
        },
      },
    ]);

    value = Number(response.text());
  } catch (e) {
    console.error(e);
  }

  const filename = `${customer_code}_${measure_datetime}_${measure_type}.${imageData.ext}`;

  try {
    await writeFile(
      `${PUBLIC_TEMP_DIR}/${filename}`,
      Buffer.from(imageData.encoded, 'base64'),
    );
  } catch (e) {
    console.error(e);
  }

  try {
    const measure = await prisma.measure.create({
      data: {
        image: filename,
        value,
        measuredAt: measure_datetime,
        typeId: measure_type,
        customerId: customer_code,
      },
    });

    res.json({
      image_url: measure.image,
      measure_value: measure.value,
      measure_uuid: measure.id,
    });
  } catch (e) {
    console.error(e);
  }
};
