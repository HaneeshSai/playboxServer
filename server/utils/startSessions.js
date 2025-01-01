import { scheduleStartSession } from "./cancelBooking.js";
import logger from "./logger.js";
import { prisma } from "./prismaClient.js";

function groupBookingsByBoxId(bookings) {
  return bookings.reduce((grouped, booking) => {
    // Check if the boxId already exists in the grouped object
    if (!grouped[booking.boxId]) {
      grouped[booking.boxId] = [];
    }
    // Add the booking to the corresponding group
    grouped[booking.boxId].push(booking);
    return grouped;
  }, {});
}

function getEarliestDateTime(timeString) {
  // Split by `_` and then `,` to get all timestamps
  const timestamps = timeString.split("_").flatMap((range) => range.split(","));

  // Find the earliest timestamp
  const earliest = timestamps.reduce((earliest, current) => {
    const currentDate = new Date(current);
    return currentDate < new Date(earliest) ? current : earliest;
  });

  return earliest;
}

export const checkIfConfirmedAndStartSession = async () => {
  try {
    console.log("starting sessions if any");
    const confirmedBookings = await prisma.bookings.findMany({
      where: {
        status: "confirmed",
      },
      select: {
        id: true,
        boxId: true,
        status: true,
        timing: true,
        userId: true,
      },
    });

    const sortedBookings = groupBookingsByBoxId(confirmedBookings);

    for (const [boxId, bookings] of Object.entries(sortedBookings)) {
      const earliestBooking = bookings.reduce((earliest, booking) => {
        const bookingEarliestTime = getEarliestDateTime(booking.timing);
        if (
          !earliest ||
          new Date(bookingEarliestTime) < new Date(earliest.time)
        ) {
          return {
            time: bookingEarliestTime,
            bookingId: booking.id,
            boxId: booking.boxId,
          };
        }
        return earliest;
      }, null);

      if (earliestBooking) {
        scheduleStartSession(
          earliestBooking.bookingId,
          earliestBooking.boxId,
          earliestBooking.time
        );
      }
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
};
