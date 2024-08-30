import type { RequestHandler } from 'express';
import { prisma } from '../prisma';

type ReqBody = {
  measure_uuid: string;
  confirmed_value: number;
};

export const confirm: RequestHandler<any, any, ReqBody> = async (req, res) => {
  try {
    await prisma.measure.update({
      where: { id: req.body.measure_uuid },
      data: { value: req.body.confirmed_value, confirmed: true },
    });

    res.json({ success: true });
  } catch (e) {
    console.error(e);
  }
};
