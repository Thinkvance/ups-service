import STATUS_FLOW from "./status.js";

const getTrackingStatus = (currentStatus) => {
  const location = "Chennai";
  const upperStatus = currentStatus?.toUpperCase();
  const currentIndex = STATUS_FLOW.indexOf(upperStatus);

  if (currentIndex === -1) {
    return [{ Status: "Unknown Status", Location: location }];
  }

  return STATUS_FLOW.map((status, index) => ({
    Status: status,
    Location: location,
    Event: index <= currentIndex,
  }));
};

export default getTrackingStatus;
