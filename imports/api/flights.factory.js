import faker from 'faker';
import _ from 'underscore';

export default FlightFactory = {
  origin: 'Berlin',
  destination: 'Munich',
  departure: faker.date.future(),
  arrival: faker.date.future(),
  airline: () => _.sample(['Lufthansa', 'Berlin Airlines']),
  aircraft: () => _.sample(['Boeing 787', 'Airbus a380']),
  flightNumber: 'L123',
  availability: () => _.random(50, 100),
  price: () => _.random(0, 1000),
  passengers: [],
};
