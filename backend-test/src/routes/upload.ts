import type { RequestHandler } from 'express';
import { prisma } from '../prisma';
import { modelHandler } from '../utils/modelHandler';
import { filesystemHandler } from '../utils/base64Handler';
import { dateHandler } from '../utils/dateHandler';

type ReqBody = {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
};

export const upload: RequestHandler<any, any, ReqBody> = async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const { firstOfMonth, lastOfMonth } = dateHandler(new Date(measure_datetime));

  try {
    const existingMeasure = await prisma.measure.findFirst({
      where: { measuredAt: { gte: firstOfMonth, lte: lastOfMonth } },
      select: { id: true },
    });

    if (existingMeasure) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }
  } catch (e) {
    console.error(e);
  }

  const filename = `${customer_code}_${measure_datetime}_${measure_type}`;

  const imageData = await filesystemHandler(image, filename);

  if (!imageData) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'O arquivo submetido é inválido',
    });
  }

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

  if (isNaN(value)) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Não foi possível gerar uma leitura válida',
    });
  }

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
