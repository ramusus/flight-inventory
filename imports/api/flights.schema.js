export default FlightSchema = new SimpleSchema({
  origin: {
    type: String,
    label: "Origin",
    max: 200
  },
  destination: {
    type: String,
    label: "Destination",
    max: 200
  },
  departure: {
    type: Date,
    label: "Departure"
  },
  arrival: {
    type: Date,
    label: "Arrival"
  },
  airline: {
    type: String,
    label: "Airline",
    max: 200
  },
  aircraft: {
    type: String,
    label: "Aircraft",
    max: 200
  },
  flightNumber: {
    type: String,
    label: "Flight Number",
    unique: true,
    max: 10
  },
  availability: {
    type: Number,
    label: "Availability",
    min: 1
  },
  price: {
    type: Number,
    label: "Price",
    min: 0
  },
  passengers: {
    type: [String],
    label: "Passengers",
    defaultValue: [],
    optional: true,
  }
});
