const convertFromDateTimeRange = (isoRange) => {
  const [startISO, endISO] = isoRange.split(",");

  if (!startISO || !endISO) return "Invalid ISO Range";

  const parseISOToTime = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  };

  const startTime = parseISOToTime(startISO);
  const endTime = parseISOToTime(endISO);

  const currentDate = new Date();
  const startDate = new Date(startISO);

  const currentDateString = currentDate.toISOString().slice(0, 10);
  const startDateString = startDate.toISOString().slice(0, 10);

  const dayIndicator = currentDateString === startDateString ? "c" : "n";

  return `${startTime}-${endTime},${dayIndicator}`;
};

export default convertFromDateTimeRange;
