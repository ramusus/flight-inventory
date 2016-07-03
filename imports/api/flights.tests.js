/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import {Flights, flightCreate, flightUpdate, flightDelete, flightBook} from './flights';

if (Meteor.isServer) {
  describe('Flights', () => {
    let userId, managerId;
    beforeEach(() => {
      Meteor.users.remove({});
      userId = Accounts.createUser({
        username: 'user',
        password: '1234567',
        email: 'user@gmail.com',
      });
      managerId = Accounts.createUser({
        username: 'manager',
        password: '1234567',
        email: 'admin@gmail.com',
      });
      Roles.addUsersToRoles(managerId, 'managers', Roles.GLOBAL_GROUP);
    });

    describe('methods', () => {
      describe('create', () => {
        let flight;
        beforeEach(() => {
          Flights.remove({});
          flight = Factory.build('flight');
          delete flight._id;
        });

        it('anonymous can\'t create flight', () => {
          assert.equal(Flights.find().count(), 0);
          assert.throws(() => {
            flightCreate._execute({}, {flight});
          }, Meteor.Error, /not-authorized/);
          assert.equal(Flights.find().count(), 0);
        });

        it('user can\'t create flight', () => {
          assert.equal(Flights.find().count(), 0);
          assert.throws(() => {
            flightCreate._execute({userId}, {flight});
          }, Meteor.Error, /no-perms/);
          assert.equal(Flights.find().count(), 0);
        });

        it('manager can create flight', () => {
          assert.equal(Flights.find().count(), 0);
          flightCreate._execute({userId: managerId}, {flight});
          assert.equal(Flights.find().count(), 1);
        });

        it('manager can\'t create flight with existed flight number', () => {
          assert.equal(Flights.find().count(), 0);
          flightCreate._execute({userId: managerId}, {flight});
          assert.equal(Flights.find().count(), 1);
          assert.throws(() => {
            flightCreate._execute({userId: managerId}, {flight});
          }, Meteor.Error, /duplicate-flight-number/);
          assert.equal(Flights.find().count(), 1);
        });
      });

      describe('', () => {
        let flight, flightId;
        beforeEach(() => {
          Flights.remove({});
          flight = Factory.create('flight');
          flightId = flight._id;
        });

        describe('book', () => {
          it('anonymous can\'t book flight', () => {
            assert.throws(() => {
              flightBook._execute({}, {flightId});
            }, Meteor.Error, /not-authorized/);
          });

          it('users can book flight', () => {
            assert.equal(Flights.find().count(), 1);
            assert.lengthOf(Flights.findOne({}).passengers, 0);
            flightBook._execute({userId}, {flightId});
            assert.lengthOf(Flights.findOne({}).passengers, 1);
            assert.include(Flights.findOne({}).passengers, userId);
            flightBook._execute({userId: managerId}, {flightId});
            assert.lengthOf(Flights.findOne({}).passengers, 2);
            assert.include(Flights.findOne({}).passengers, userId);
            assert.include(Flights.findOne({}).passengers, managerId);
          });

          it('users can\'t book flight twice', () => {
            assert.equal(Flights.find().count(), 1);
            assert.lengthOf(Flights.findOne({}).passengers, 0);
            flightBook._execute({userId}, {flightId});
            assert.lengthOf(Flights.findOne({}).passengers, 1);
            assert.include(Flights.findOne({}).passengers, userId);
            assert.throws(() => {
              flightBook._execute({userId}, {flightId});
            }, Meteor.Error, /flight-already-booked/);
          });
        });

        describe('delete', () => {
          it('anonymous can\'t delete flight', () => {
            assert.equal(Flights.find().count(), 1);
            assert.throws(() => {
              flightDelete._execute({}, {flightId});
            }, Meteor.Error, /not-authorized/);
            assert.equal(Flights.find().count(), 1);
          });

          it('user can\'t delete flight', () => {
            assert.equal(Flights.find().count(), 1);
            assert.throws(() => {
              flightDelete._execute({userId}, {flightId});
            }, Meteor.Error, /no-perms/);
            assert.equal(Flights.find().count(), 1);
          });

          it('manager can delete flight', () => {
            assert.equal(Flights.find().count(), 1);
            flightDelete._execute({userId: managerId}, {flightId});
            assert.equal(Flights.find().count(), 0);
          });
        });

        describe('update', () => {
          beforeEach(() => {
            delete flight._id;
            flight.destination = 'Dresden';
          });

          it('anonymous can\'t update flight', () => {
            assert.equal(Flights.find().count(), 1);
            assert.throws(() => {
              flightUpdate._execute({}, {flightId, flight});
            }, Meteor.Error, /not-authorized/);
            assert.notEqual(Flights.findOne({}).destination, flight.destination);
          });

          it('user can\'t update flight', () => {
            assert.equal(Flights.find().count(), 1);
            assert.throws(() => {
              flightUpdate._execute({userId}, {flightId, flight});
            }, Meteor.Error, /no-perms/);
            assert.notEqual(Flights.findOne({}).destination, flight.destination);
          });

          it('manager can update flight', () => {
            assert.equal(Flights.find().count(), 1);
            flightUpdate._execute({userId: managerId}, {flightId, flight});
            assert.equal(Flights.findOne({}).destination, flight.destination);
          });

          it('manager can\'t update flight with existed flight number', () => {
            assert.equal(Flights.find().count(), 1);
            flight.flightNumber = flight.flightNumber + '111';
            flightCreate._execute({userId: managerId}, {flight});
            assert.equal(Flights.find().count(), 2);
            assert.throws(() => {
              flightUpdate._execute({userId: managerId}, {flightId, flight});
            }, Meteor.Error, /duplicate-flight-number/);
          });

        });
      });
    });
  });
}
