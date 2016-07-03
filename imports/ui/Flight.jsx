import React from 'react';
import {Row, Col, Button, Glyphicon} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// Flight component - represents a single todo item
class Flight extends React.Component {
  static propTypes = {
    flight: React.PropTypes.object.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
    handleUpdate: React.PropTypes.func.isRequired,
    handleBook: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.dateFormat = 'YYYY MMM DD HH:mm'
  }

  handleDelete = () => {
    if (confirm("Are you sure you want to delete it?")) {
      this.props.handleDelete(this.props.flight._id);
    }
  };

  handleUpdate = () => {
    this.props.handleUpdate(this.props.flight);
    window.scrollTo(0, 0);
  };

  handleBook = () => {
    if (confirm("Are you sure you want to book this flight?")) {
      this.props.handleBook(this.props.flight._id);
    }
  };

  renderButtons() {
    if (!this.props.currentUser) {
      return ''
    } else {
      if (Roles.userIsInRole(this.props.currentUser, 'managers')) {
        return <Col lg={1} sm={1} className="flightManagement">
          <Button bsSize="xsmall" onClick={this.handleUpdate}><Glyphicon glyph="edit"/></Button>
          <Button bsSize="xsmall" onClick={this.handleDelete}><Glyphicon glyph="remove"/></Button>
        </Col>
      } else {
        const disabled = _.indexOf(this.props.flight.passengers, this.props.currentUser._id) != -1;
        return <Col lg={1} sm={1} className="flightManagement">
          <Button bsSize="xsmall" onClick={this.handleBook} disabled={disabled}><Glyphicon glyph="plane"/></Button>
        </Col>
      }
    }
  }

  render() {
    return (
      <Row>
        <Col lg={3} sm={3}>
          {moment(this.props.flight.departure).format(this.dateFormat)}
          &nbsp;-&nbsp;
          {moment(this.props.flight.arrival).format(this.dateFormat)}
        </Col>
        <Col lg={2} sm={2}>{this.props.flight.origin} - {this.props.flight.destination}</Col>
        <Col lg={1} sm={1}>{this.props.flight.flightNumber}</Col>
        <Col lg={2} sm={2}>{this.props.flight.airline}</Col>
        <Col lg={1} sm={1}>{this.props.flight.aircraft}</Col>
        <Col lg={1} sm={1}>{this.props.flight.availability}</Col>
        <Col lg={1} sm={1}>{this.props.flight.price}</Col>
        {this.renderButtons()}
      </Row>
    );
  }
}

export default Flight;
