import { prisma } from "../../utils/prismaClient.js";
import { verifyToken } from "../../config/jwt.js";
import { logError } from "../../utils/errorUtils.js";

export const registerBox = async (req, res) => {
  const { data, token } = req.body;
  const { userId } = verifyToken(token);

  const formdata = {
    ...data,
    availableSports: data.sports.map((e) => e.value).toString(),
    fullAddress: data.address,
    ownerId: userId,
  };
  delete formdata.sports;
  delete formdata.address;

  formdata.timings = formdata.timings.split(" ").join("");

  try {
    const newBox = await prisma.box.create({
      data: formdata,
    });

    const currentStatus = await prisma.currentStatus.create({
      data: {
        totalTeamSize: 0,
        currentTeamSize: 0,
        status: "a",
        price: newBox.price,
        boxId: newBox.id,
      },
    });

    return res.status(200).json({ message: "Registered Succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBoxes = async (req, res) => {
  const { city } = req.body;
  try {
    const boxes = await prisma.box.findMany({
      where: {
        city: city,
      },
      select: {
        placeName: true,
        timings: true,
        area: true,
        availableSports: true,
        currentStatus: true,
        booking: {
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            status: {
              notIn: ["cancelled", "Ended"],
            },
          },
          select: {
            timing: true,
            status: true,
            id: true,
            totalTeamSize: true,
            currentTeamSize: true,
          },
        },
      },
    });

    // console.log(boxes);

    return res.status(200).json({ boxes });
  } catch (error) {
    logError(error, res);
  }
};

export const getBoxDetails = async (req, res) => {
  const { id } = req.body;

  try {
    const details = await prisma.box.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        currentStatus: true,
        booking: {
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            status: {
              notIn: ["cancelled", "Ended"],
            },
          },
          select: {
            timing: true,
            status: true,
            id: true,
            totalTeamSize: true,
            currentTeamSize: true,
          },
        },
      },
    });

    return res.status(200).json(details);
  } catch (error) {
    logError(error, res);
  }
};

export const getLookingBookings = async (req, res) => {
  const { boxId } = req.body;
  try {
    const bookings =
      await prisma.$queryRaw`SELECT "id", "joinedPlayers", "splitPricePerPlayer", "sport", "teamName", "currentTeamSize", "extraPlayersNeeded" from bookings where "boxId" = ${boxId} AND "currentTeamSize" < "totalTeamSize" AND "status" = 'confirmed' ORDER BY "createdAt" DESC `;

    return res.status(200).json({ bookings });
  } catch (error) {
    logError(error, res);
  }
};

export const findBox = async (req, res) => {
  const { query } = req.body;
  try {
    const boxes = await prisma.box.findMany({
      where: {
        OR: [
          {
            city: {
              contains: query, // Matches if `searchString` is part of the city name
              mode: "insensitive", // Case-insensitive match
            },
          },
          {
            placeName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            area: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            availableSports: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        placeName: true,
        timings: true,
        area: true,
        availableSports: true,
        currentStatus: true,
        booking: {
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
          where: {
            status: {
              notIn: ["cancelled", "Ended"],
            },
          },
          select: {
            timing: true,
            status: true,
            id: true,
            totalTeamSize: true,
            currentTeamSize: true,
          },
        },
      },
    });

    return res.status(200).json({ boxes });
  } catch (error) {
    logError(error, res);
  }
};
