import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await Product.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json(products);
      } catch (error) {
        res.status(400).json([]);
      }
      break;
    case "POST":
      try {
        const product = await Product.create(body);
        res.status(201).json(product);
      } catch (error) {
        res.status(400).end();
      }
      break;
    default:
      res.status(404).end();
      break;
  }
}
