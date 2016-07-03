import React from 'react';
import {Nav, Row, Col} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import { Flights } from '../api/flights.js';
import Flight from './Flight';

class FlightList extends React.Component {
  static propTypes = {
    flights: React.PropTypes.array.isRequired,
    startEditing: React.PropTypes.func.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
    handleBook: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object,
  };

  render() {
    return !this.props.flights ? '' : (
      <div>
        <Row>
          <Col lg={3} sm={3}>Time</Col>
          <Col lg={2} sm={2}>Route</Col>
          <Col lg={1} sm={1}>FN</Col>
          <Col lg={2} sm={2}>Airline</Col>
          <Col lg={1} sm={1}>Aircraft</Col>
          <Col lg={1} sm={1}>Availability</Col>
          <Col lg={1} sm={1}>Price</Col>
          <Col lg={1} sm={1}></Col>
        </Row>
        {this.props.flights.map(flight => <Flight
          key={flight._id} flight={flight} currentUser={this.props.currentUser} handleUpdate={this.props.startEditing}
          handleBook={this.props.handleBook} handleDelete={this.props.handleDelete}/>)}
      </div>
    );
  }
}

FlightList = createContainer(props => {
  Meteor.subscribe('flights');

  const params = {};
  ['origin', 'destination', 'airlines'].map(field => {
    if (props.params[field]) {
      params[field] = {$regex: `^${props.params[field]}`}
    }
  });
  if (props.params.departure) {
    params.departure = {
      $gte: moment(props.params.departure).toDate(),
      $lt: moment(props.params.departure).add(1, 'days').toDate(),
    }
  }
  if (props.params.passengers) {
    params.availability = {$gte: props.params.passengers * 1}
  }

  return {
    flights: Flights.find(params, {sort: {departure: 1}}).fetch(),
  };
}, FlightList);

export default FlightList;
