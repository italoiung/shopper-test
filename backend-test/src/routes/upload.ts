import type { RequestHandler } from 'express';
import { prisma } from '../prisma';
import { modelHandler } from '../utils/modelHandler';
import { filesystemHandler } from '../utils/base64Handler';

type ReqBody = {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
};

export const upload: RequestHandler<any, any, ReqBody> = async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const filename = `${customer_code}_${measure_datetime}_${measure_type}`;

  const imageData = await filesystemHandler(image, filename);

  if (!imageData) return;

  const modelResponse = await modelHandler([
    'Transcribe only the numbers on this image',
    {
      inlineData: {
        data: imageData.encoded,
        mimeType: imageData.mimeType,
      },
    },
  ]);

  const value = Number(modelResponse);

  try {
    const measure = await prisma.measure.create({
      data: {
        image: `${filename}.${imageData.ext}`,
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
