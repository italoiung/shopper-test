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
    where.AND = { typeId: req.query.measure_type };
  }

  try {
    const measures = await prisma.measure.findMany({
      where,
    });

    res.json({ customer_code: customerId, measures });
  } catch (e) {
    console.error(e);
  }
};
