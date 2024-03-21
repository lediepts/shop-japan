import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Trademark from "../../../models/Trademark";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  await dbConnect();
  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const trademark = await Trademark.findByIdAndUpdate(id, req.body, {
          new: false,
          runValidators: true,
        });
        if (!trademark) {
          return res.status(400).end();
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end();
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedTrademark = await Trademark.deleteOne({ _id: id });
        if (!deletedTrademark) {
          return res.status(400).end();
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end();
      }
      break;

    default:
      res.status(400).end();
      break;
  }
}
