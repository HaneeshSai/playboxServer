import logger from "./logger.js";
import { prisma } from "./prismaClient.js";

export const cancelBooking = (bookingId, boxId, time) => {
  const now = new Date();
  const cancellationTime = new Date(time.split(",")[0]);
  cancellationTime.setMinutes(cancellationTime.getMinutes() - 2);

  const delay = cancellationTime - now;

  if (delay > 0) {
    logger.info(`Task scheduled to run in ${delay / 1000} seconds.`);
    setTimeout(() => {
      updateStatus(boxId, bookingId).catch((err) => console.log(err));
    }, delay);
  } else {
    updateStatus(boxId, bookingId).catch((err) => console.log(err));
  }
};

const updateStatus = async (boxid, bookingId) => {
  const checkStatus = await prisma.bookings.findFirst({
    where: {
      id: bookingId,
    },
    select: {
      status: true,
    },
  });

  if (checkStatus.status === "waiting for Payment") {
    const updateCS = await prisma.currentStatus.update({
      where: {
        boxId: boxid,
      },
      data: {
        totalTeamSize: 0,
        currentTeamSize: 0,
      },
    });

    const updateBooking = await prisma.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "cancelled",
      },
    });
    logger.info("Booking Cancelled");
  }
};

export const endSession = (boxid, bookingId, time) => {
  const now = new Date();
  const cancellationTime = new Date(time);

  const delay = cancellationTime - now;

  if (delay > 0) {
    logger.info(`Task scheduled to run in ${delay / 1000} seconds.`);
    setTimeout(() => {
      updateEndEssion(boxid, bookingId).catch((err) => console.log(err));
    }, delay);
  } else {
    updateEndEssion(boxid, bookingId).catch((err) => console.log(err));
  }
};

const updateEndEssion = async (boxid, bookingId) => {
  const updateCS = await prisma.currentStatus.update({
    where: {
      boxId: boxid,
    },
    data: {
      totalTeamSize: 0,
      currentTeamSize: 0,
    },
  });

  const updateBooking = await prisma.bookings.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "Ended",
    },
  });
  logger.info("Booking Cancelled");
};

export const checkPaymentStatusAndCancelBookings = async () => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        status: "waiting for Payment",
      },
      select: {
        boxId: true,
        timing: true,
        id: true,
      },
    });

    bookings.forEach((e) => {
      cancelBooking(e.id, e.boxId, e.timing.split("_")[0].split(",")[0]);
    });
  } catch (error) {
    console.log(error);
  }
};

export const scheduleStartSession = async (bookingId, boxId, time) => {
  const now = new Date();
  const cancellationTime = new Date(time.split(",")[0]);
  cancellationTime.setMinutes(cancellationTime.getMinutes() - 10);

  const delay = cancellationTime - now;
  if (delay > 0) {
    logger.info(`Task start scheduled to run in ${delay / 1000} seconds.`);
    setTimeout(() => {
      startSession(boxId, bookingId);
    }, delay);
  } else {
    startSession(boxId, bookingId);
  }
};

const startSession = async (boxId, bookingId) => {
  const updateBooking = await prisma.bookings.update({
    where: {
      id: parseInt(bookingId),
    },
    data: {
      status: "started",
      paymentStatus: "confirmed",
    },
  });

  const updateCS = await prisma.currentStatus.update({
    where: {
      boxId,
    },
    data: {
      currentTeamSize: updateBooking.currentTeamSize,
      totalTeamSize: updateBooking.totalTeamSize,
    },
  });

  logger.info("starting session");
  endSession(boxId, bookingId, getFarthestDateTime(updateBooking.timing));
};

function getFarthestDateTime(timeString) {
  // Split by `_` and then `,` to get all timestamps
  const timestamps = timeString.split("_").flatMap((range) => range.split(","));

  // Find the farthest (latest) timestamp
  const farthest = timestamps.reduce((latest, current) => {
    const currentDate = new Date(current);
    return currentDate > new Date(latest) ? current : latest;
  });

  return farthest;
}
