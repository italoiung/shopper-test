import type { RequestHandler } from 'express';
import { prisma } from '../prisma';

type ReqBody = {
  measure_uuid: string;
  confirmed_value: number;
};

export const confirm: RequestHandler<any, any, ReqBody> = async (req, res) => {
  const { measure_uuid, confirmed_value } = req.body;

  try {
    const measure = await prisma.measure.findUnique({
      where: { id: measure_uuid },
      select: { confirmed: true },
    });

    if (!measure) {
      return res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    if (measure.confirmed) {
      return res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada',
      });
    }
  } catch (e) {
    console.error(e);
  }
  try {
    await prisma.measure.update({
      where: { id: measure_uuid },
      data: { value: confirmed_value, confirmed: true },
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
  }
};
