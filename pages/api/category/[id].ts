import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Category from "../../../models/Category";
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
        const category = await Category.findByIdAndUpdate(id, req.body, {
          new: false,
          runValidators: true,
        });
        if (!category) {
          return res.status(400).end();
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end();
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedCategory = await Category.deleteOne({ _id: id });
        if (!deletedCategory) {
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
