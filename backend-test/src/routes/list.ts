import type { RequestHandler } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

type ReqParams = {
  customerId: string;
};

type QueryParams = {
  measure_type?: string;
};

export const list: RequestHandler<ReqParams, any, any, QueryParams> = async (
  req,
  res,
) => {
  const { customerId } = req.params;

  const where: Prisma.MeasureFindManyArgs['where'] = {
    customerId,
  };

  if (req.query.measure_type) {
    try {
      const type = await prisma.type.findUnique({
        where: { id: req.query.measure_type.toUpperCase() },
      });

      if (!type) {
        return res.status(400).json({
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        });
      }

      where.AND = { type };
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const measures = await prisma.measure.findMany({
      where,
    });

    if (!measures.length) {
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    res.json({ customer_code: customerId, measures });
  } catch (e) {
    console.error(e);
  }
};
