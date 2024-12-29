import { prisma } from "../../utils/prismaClient.js";
import { verifyToken, generateToken } from "../../config/jwt.js";
import { logError } from "../../utils/errorUtils.js";
import { convertToDateTimeRange } from "../../utils/convertToDateTime.js";
import {
  cancelBooking,
  scheduleStartSession,
} from "../../utils/cancelBooking.js";

export const authUser = async (req, res) => {
  const { name, phone, email, isOwner } = req.body;

  const conditions = [];
  if (email) {
    conditions.push({ email });
  }
  if (phone) {
    conditions.push({ phone });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    if (user) {
      const userBox = await prisma.box.findFirst({
        where: {
          ownerId: user.id,
        },
      });

      const token = generateToken(user.id);
      return res.status(200).json({
        message: "Authenticated Succesfully",
        token,
        existing: userBox ? true : false,
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          fullName: name,
          email,
          phone,
          owner: isOwner,
        },
      });

      const token = generateToken(newUser.id);

      return res.status(200).json({
        message: "Authenticated Successfully",
        existing: false,
        token,
      });
    }
  } catch (error) {
    logError(error, res);
  }
};

export const createBooking = async (req, res) => {
  const { data } = req.body;

  try {
    const { userId } = verifyToken(data.token);
    const timingss = data.timings.map((e) => {
      return convertToDateTimeRange(e);
    });

    const booking = await prisma.bookings.create({
      data: {
        teamName: data.teamName,
        totalTeamSize: Number(data.totalTeamSize),
        needExtraPlayers: data.needExtraPlayers,
        currentTeamSize: Number(data.currentTeamSize),
        sport: data.sport,
        timing: timingss.join("_"),
        extraPlayersNeeded:
          Number(data.totalTeamSize) - Number(data.currentTeamSize),
        joinedPlayers: 0,
        splitPricePerPlayer: data.needExtraPlayers
          ? Number(data.price) / data.totalTeamSize
          : null,
        price: Number(data.price),
        amountPayed: 0,
        status: "waiting for Payment",
        paymentStatus: "waiting for confirmation",
        remainingAmount: Number(data.actualPrice) - Number(data.price),
        boxId: data.boxId,
        userId: userId,
      },
    });

    const startTiming = new Date(timingss[0].split(",")[0]);
    const nowTime = new Date();
    const difference = startTiming - nowTime;

    if (difference > 0 && difference <= 29 * 60 * 1000) {
      const updateCS = await prisma.currentStatus.update({
        where: {
          boxId: data.boxId,
        },
        data: {
          currentTeamSize: Number(data.currentTeamSize),
          totalTeamSize: Number(data.totalTeamSize),
        },
      });
    }

    cancelBooking(booking.id, data.boxId, timingss[0]);

    res.status(200).json({ msg: "booking done", bookingId: booking.id });
  } catch (error) {
    logError(error, res);
  }
};

export const handlePayment = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const updateBooking = await prisma.bookings.update({
      where: {
        id: parseInt(bookingId),
      },
      data: {
        status: "confirmed",
        paymentStatus: "confirmed",
      },
    });

    scheduleStartSession(
      bookingId,
      updateBooking.boxId,
      updateBooking.timing.split("_")[0]
    );
    return res.status(200).json({ message: "Your Booking is Confirmed" });
  } catch (error) {
    logError(error, res);
  }
};

export const joinExistingTeam = async (req, res) => {
  const { data } = req.body;
  try {
    const { userId } = verifyToken(data.token);
    const newPlayer = await prisma.extraPlayers.create({
      data: {
        name: data.teamName,
        userId: userId,
        numberOfPlayers: Number(data.currentTeamSize),
        price: Number(data.price),
        bookingId: Number(data.bookingId),
        paymentStatus: false,
      },
    });

    await prisma.bookings.update({
      where: {
        id: data.bookingId,
      },
      data: {
        joinedPlayers: {
          increment: newPlayer.numberOfPlayers,
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Your Booking confirmed", id: newPlayer.id });
  } catch (error) {
    logError(error, res);
  }
};

export const handleExtraPlayerPayment = async (req, res) => {
  const { extraPlayerId } = req.body;
  try {
    const extraPlayer = await prisma.extraPlayers.update({
      where: {
        id: Number(extraPlayerId),
      },
      data: {
        paymentStatus: true,
      },
    });

    await prisma.bookings.update({
      where: {
        id: extraPlayer.bookingId,
      },
      data: {
        remainingAmount: {
          decrement: extraPlayer.price,
        },
      },
    });

    return res.status(200).json({ message: "Payment Confirmed" });
  } catch (error) {
    logError(error, res);
  }
};

export const getUserProfile = async (req, res) => {
  const { token } = req.body;
  try {
    const { userId } = verifyToken(token);
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        fullName: true,
        phone: true,
        email: true,
        owner: true,
        bookings: true,
        extraPlayers: true,
      },
    });

    return res.status(200).json({ details: user });
  } catch (error) {
    logError(error, res);
  }
};
