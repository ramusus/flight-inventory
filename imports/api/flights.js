import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import FlightSchema from './flights.schema';
import FlightFactory from './flights.factory';

export const Flights = new Mongo.Collection('flights');

Flights.attachSchema(FlightSchema);
Factory.define('flight', Flights, FlightFactory);

if (Meteor.isServer) {
  Meteor.publish('flights', function flightsPublication() {
    return Flights.find({});
  });
}

function checkUser(userId) {
  if (!userId) {
    throw new Meteor.Error('not-authorized');
  }
  if (!Roles.userIsInRole(userId, 'managers')) {
    throw new Meteor.Error('no-perms');
  }
}

export const flightCreate = new ValidatedMethod({
  name: 'flights.insert',
  validate: new SimpleSchema({
    flight: {type: FlightSchema},
  }).validator(),
  run({ flight }) {
    checkUser(this.userId);
    if (Flights.find({flightNumber: flight.flightNumber}).count() > 0) {
      throw new Meteor.Error('duplicate-flight-number');
    }
    Flights.insert(flight);
  }
});

export const flightUpdate = new ValidatedMethod({
  name: 'flights.update',
  validate: new SimpleSchema({
    flightId: {type: String},
    flight: {type: FlightSchema},
  }).validator(),
  run({ flightId, flight }) {
    checkUser(this.userId);
    if (Flights.find({flightNumber: flight.flightNumber, _id: {$not: {$eq: flightId}}}).count() > 0) {
      throw new Meteor.Error('duplicate-flight-number');
    }
    Flights.update(flightId, {$set: flight});
  }
});

export const flightDelete = new ValidatedMethod({
  name: 'flights.remove',
  validate: new SimpleSchema({
    flightId: {type: String},
  }).validator(),
  run({ flightId }) {
    checkUser(this.userId);
    Flights.remove(flightId);
  }
});

export const flightBook = new ValidatedMethod({
  name: 'flights.book',
  validate: new SimpleSchema({
    flightId: {type: String},
  }).validator(),
  run({ flightId }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const flight = Flights.findOne(flightId);
    flight.passengers = flight.passengers || [];
    if (_.indexOf(flight.passengers, this.userId) != -1) {
      throw new Meteor.Error('flight-already-booked');
    }
    flight.passengers.push(this.userId);
    Flights.update(flightId, {$set: {passengers: flight.passengers}});
  }
});
