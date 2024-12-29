const checkIfOpen = (time) => {
  const times = time.split("-");

  const parseTime = (timeStr) => {
    const amOrPm = timeStr.slice(-2).toLowerCase();
    let hours = parseInt(timeStr.slice(0, -2));
    if (amOrPm === "pm" && hours !== 12) hours += 12; // Convert PM to 24-hour format
    if (amOrPm === "am" && hours === 12) hours = 0; // Handle midnight case
    return hours;
  };

  const openingHour = parseTime(times[0]);
  const closingHour = parseTime(times[1]);
  const currentHour = new Date().getHours();

  let isOpen;
  if (openingHour <= closingHour) {
    // Normal case: e.g., "8am-5pm"
    isOpen = currentHour >= openingHour && currentHour < closingHour;
  } else {
    // Overnight case: e.g., "11pm-2am"
    isOpen = currentHour >= openingHour || currentHour < closingHour;
  }

  return isOpen ? "Opened" : "Closed";
};

export default checkIfOpen;
