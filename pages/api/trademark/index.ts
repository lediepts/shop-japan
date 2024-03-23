import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Trademark from "../../../models/Trademark";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ITrademark } from "../../../types/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { name, logo },
  } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const trademarks = (
          (await Trademark.find()
            .sort({ name: -1 })
            .lean()
            .exec()) as ITrademark[]
        ).map((v) => ({ ...v, _id: v._id.toString() }));
        res.status(200).json(trademarks);
      } catch (error) {
        res.status(400).json([]);
      }
      break;
    case "POST":
      try {
        const trademark = await Trademark.create({ name, logo });
        res.status(201).json(trademark);
      } catch (error) {
        res.status(400).end();
      }
      break;
    default:
      res.status(404).end();
      break;
  }
}
