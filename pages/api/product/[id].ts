import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
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
        const product = await Product.findByIdAndUpdate(id, req.body, {
          new: false,
          runValidators: true,
        });
        if (!product) {
          return res.status(400).end();
        }
        res.status(200).end();
      } catch (error) {
        res.status(400).end();
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedProduct = await Product.deleteOne({ _id: id });
        if (!deletedProduct) {
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
