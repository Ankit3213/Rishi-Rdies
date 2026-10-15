export type VehicleType = 'E-rickshaw' | 'CNG auto-rickshaw';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DriverCandidate = {
  id: string;
  active: boolean;
  location: Coordinates;
};

export function vehicleForPassengerCount(passengerCount: number): VehicleType {
  if (!Number.isInteger(passengerCount) || passengerCount < 1) {
    throw new RangeError('Passenger count must be a positive whole number.');
  }

  return passengerCount <= 3 ? 'E-rickshaw' : 'CNG auto-rickshaw';
}

export function distanceInKilometres(
  origin: Coordinates,
  destination: Coordinates
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(destination.latitude - origin.latitude);
  const longitudeDelta = radians(destination.longitude - origin.longitude);
  const originLatitude = radians(origin.latitude);
  const destinationLatitude = radians(destination.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function eligibleDrivers(
  pickup: Coordinates | null,
  drivers: DriverCandidate[],
  maximumDistanceKm = 10
): DriverCandidate[] {
  if (!pickup) return [];

  return drivers.filter(
    (driver) =>
      driver.active && distanceInKilometres(pickup, driver.location) <= maximumDistanceKm
  );
}