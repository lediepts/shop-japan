import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: {
      credentials: { username, password },
    },
  } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const user = await User.findOne({
          name: username,
          password,
        });
        if (!user) return res.status(404).json({ error: true });
        res.status(201).json({ error: false, user });
      } catch (error) {
        res.status(400).json({ error: true });
      }
      break;
    default:
      res.status(400).json({ error: true });
      break;
  }
}
