import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Category from "../../../models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ICategory } from "../../../types/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { name },
  } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const categories = (
          (await Category.find()
            .sort({ name: -1 })
            .lean()
            .exec()) as ICategory[]
        ).map((v) => ({ ...v, _id: v._id.toString() }));
        res.status(200).json(categories);
      } catch (error) {
        res.status(400).json([]);
      }
      break;
    case "POST":
      try {
        const category = await Category.create({ name });
        res.status(201).json(category);
      } catch (error) {
        res.status(400).end();
      }
      break;
    default:
      res.status(404).end();
      break;
  }
}
