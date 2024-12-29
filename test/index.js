const bookings = [
  {
    id: 1,
    status: "confirmed",
    boxId: 1,
    userId: 1,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
  {
    id: 2,
    status: "confirmed",
    boxId: 2,
    userId: 2,
    timing: "2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 3,
    status: "confirmed",
    boxId: 3,
    userId: 3,
    timing:
      "2024-12-07T17:30,2024-12-07T18:30_2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 4,
    status: "confirmed",
    boxId: 4,
    userId: 4,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 5,
    status: "confirmed",
    boxId: 5,
    userId: 5,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
  {
    id: 6,
    status: "confirmed",
    boxId: 1,
    userId: 6,
    timing: "2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 7,
    status: "confirmed",
    boxId: 2,
    userId: 7,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 8,
    status: "confirmed",
    boxId: 3,
    userId: 8,
    timing:
      "2024-12-07T17:30,2024-12-07T18:30_2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 9,
    status: "confirmed",
    boxId: 4,
    userId: 9,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 10,
    status: "confirmed",
    boxId: 5,
    userId: 10,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
  {
    id: 11,
    status: "confirmed",
    boxId: 1,
    userId: 11,
    timing: "2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 12,
    status: "confirmed",
    boxId: 2,
    userId: 12,
    timing:
      "2024-12-07T17:30,2024-12-07T18:30_2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 13,
    status: "confirmed",
    boxId: 3,
    userId: 13,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 14,
    status: "confirmed",
    boxId: 4,
    userId: 14,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
  {
    id: 15,
    status: "confirmed",
    boxId: 5,
    userId: 15,
    timing: "2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 16,
    status: "confirmed",
    boxId: 1,
    userId: 16,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 17,
    status: "confirmed",
    boxId: 2,
    userId: 17,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
  {
    id: 18,
    status: "confirmed",
    boxId: 3,
    userId: 18,
    timing: "2024-12-07T19:00,2024-12-07T20:00",
  },
  {
    id: 19,
    status: "confirmed",
    boxId: 4,
    userId: 1,
    timing: "2024-12-07T18:00,2024-12-07T19:00",
  },
  {
    id: 20,
    status: "confirmed",
    boxId: 5,
    userId: 2,
    timing: "2024-12-07T17:30,2024-12-07T18:30",
  },
];

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

console.log(groupBookingsByBoxId(bookings));

const findShortestBooking = () => {};
