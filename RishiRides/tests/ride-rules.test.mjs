import assert from 'node:assert/strict';
import test from 'node:test';
import {
  eligibleDrivers,
  vehicleForPassengerCount,
} from '../src/domain/ride-rules.ts';

test('vehicle selection follows the passenger capacity threshold', () => {
  assert.equal(vehicleForPassengerCount(3), 'E-rickshaw');
  assert.equal(vehicleForPassengerCount(4), 'CNG auto-rickshaw');
  assert.throws(() => vehicleForPassengerCount(0), RangeError);
});

test('matching requires a known pickup and active drivers within 10 km', () => {
  const pickup = { latitude: 30, longitude: 78 };
  const drivers = [
    { id: 'near-active', active: true, location: { latitude: 30.05, longitude: 78 } },
    { id: 'far-active', active: true, location: { latitude: 30.1, longitude: 78 } },
    { id: 'near-inactive', active: false, location: { latitude: 30.01, longitude: 78 } },
  ];

  assert.deepEqual(eligibleDrivers(null, drivers), []);
  assert.deepEqual(
    eligibleDrivers(pickup, drivers).map((driver) => driver.id),
    ['near-active']
  );
});