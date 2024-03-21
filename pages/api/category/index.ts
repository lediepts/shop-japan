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
    method,
    body: { name, alias },
  } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const categories = await Category.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json(categories);
      } catch (error) {
        res.status(400).json([]);
      }
      break;
    case "POST":
      try {
        const category = await Category.create({ name, alias });
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
