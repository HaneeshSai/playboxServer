import { prisma } from "../../utils/prismaClient.js";
import { verifyToken } from "../../config/jwt.js";
import { logError } from "../../utils/errorUtils.js";

export const getOwnerBox = async (req, res) => {
  const { token } = req.body;
  try {
    const { userId } = verifyToken(token);

    const getBox = await prisma.box.findFirst({
      where: {
        ownerId: userId,
      },
      select: {
        ownersName: true,
        phone: true,
        email: true,
        placeName: true,
        fullAddress: true,
        price: true,
        availableSports: true,
        description: true,
        rules: true,
        refundPolicy: true,
        currentStatus: true,
        timings: true,
        booking: true,
      },
    });

    return res.status(200).json({ box: getBox });
  } catch (error) {
    logError(error, res);
  }
};

export const updateCurrentStatus = async (req, res) => {
  const { data } = req.body;
  const id = data.id;
  delete data.id;

  data.totalTeamSize = Number(data.totalTeamSize);
  data.currentTeamSize = Number(data.currentTeamSize);
  data.price = Number(data.price);

  try {
    const updateRow = await prisma.currentStatus.update({
      data: data,
      where: {
        id: id,
      },
    });

    return res.status(200).json({ message: "Updated" });
  } catch (error) {
    logError(error, res);
  }
};
