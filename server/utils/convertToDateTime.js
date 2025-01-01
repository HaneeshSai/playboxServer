export const convertToDateTimeRange = (input) => {
  const currentDate = new Date();
  const [timeRange, dayIndicator] = input.split(",");

  const [startTime, endTime] = timeRange.split("-");

  const targetDate = new Date(currentDate);
  if (dayIndicator === "n") {
    targetDate.setDate(currentDate.getDate() + 1);
  }

  const parseTimeToISO = (time, baseDate) => {
    const [hourMinute, period] = time.split(/(am|pm)/i);
    const [hour, minute] = hourMinute.split(":").map(Number);

    let parsedHour =
      period.toLowerCase() === "pm" && hour !== 12
        ? hour + 12
        : period.toLowerCase() === "am" && hour === 12
        ? 0
        : hour;

    const adjustedDate = new Date(
      Date.UTC(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        parsedHour,
        minute,
        0
      )
    );
    return adjustedDate.toISOString().slice(0, 16);
  };

  const startDateTimeISO = parseTimeToISO(startTime, targetDate);
  const endDateTimeISO = parseTimeToISO(endTime, targetDate);

  return `${startDateTimeISO},${endDateTimeISO}`;
};
