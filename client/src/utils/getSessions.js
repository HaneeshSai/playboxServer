function getSessions(timingsString) {
  const convertTo24Hour = (timeString) => {
    const [hour, period] = timeString.match(/(\d+)(am|pm)/).slice(1);
    let hour24 = parseInt(hour);
    if (period === "pm" && hour24 !== 12) hour24 += 12;
    if (period === "am" && hour24 === 12) hour24 = 0;
    return hour24;
  };

  const [openTime, closeTimeRaw] = timingsString.split("-").map((time) => {
    const [hourStr] = time.split(" ");
    return convertTo24Hour(hourStr);
  });

  const closeTime = closeTimeRaw === 0 ? 24 : closeTimeRaw;

  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();

  const sessions = [];
  let currentTimeHour = currentHour;
  let currentTimeMinutes = currentMinutes <= 30 ? 30 : 0;

  if (currentMinutes > 30) currentTimeHour += 1;

  let addedNextDay = false;
  let skipNext = false;

  while (sessions.length < 20) {
    if (skipNext) {
      skipNext = false;
      currentTimeHour += 1;
      continue;
    }

    const startHour24 = currentTimeHour % 24;
    const endHour24 = (currentTimeHour + 1) % 24;

    const startMinutesFormatted = currentTimeMinutes
      .toString()
      .padStart(2, "0");
    const endMinutesFormatted = currentTimeMinutes.toString().padStart(2, "0");

    const isWithinHours =
      (startHour24 >= openTime && startHour24 < closeTime) ||
      (closeTime <= openTime &&
        (startHour24 >= openTime || startHour24 < closeTime));

    if (isWithinHours) {
      const startHour12 = startHour24 % 12 || 12;
      const endHour12 = endHour24 % 12 || 12;

      const startPeriod = startHour24 >= 12 ? "pm" : "am";
      const endPeriod = endHour24 >= 12 ? "pm" : "am";

      const sessionType = addedNextDay ? ",n" : ",c";

      sessions.push(
        `${startHour12}:${startMinutesFormatted}${startPeriod}-${endHour12}:${endMinutesFormatted}${endPeriod}${sessionType}`
      );

      // If the session starts at the half hour, skip the next half hour
      if (currentTimeMinutes === 30) {
        skipNext = true;
      }
    } else if (!addedNextDay) {
      sessions.push("Next Day");
      addedNextDay = true;

      // Reset to opening time for the next day
      currentTimeHour = openTime;
      currentTimeMinutes = 0;
      continue; // Skip to the next iteration
    }

    // Advance time by one hour
    currentTimeMinutes = 0;
    currentTimeHour += 1;

    if (currentTimeHour >= 24) currentTimeHour %= 24;
  }

  return sessions;
}

export default getSessions;
