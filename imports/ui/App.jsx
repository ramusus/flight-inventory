import React from 'react';
import {Nav, Row, Col} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Flight from './Flight';
import FlightList from './FlightList';
import FlightForm from './FlightForm';
import FlightsFilterForm from './FlightFilterForm';
import Header from './Header.jsx';

class App extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {editingFlight: null, searchParams: {}};
  }

  handleCreate = (flight) => {
    event.preventDefault();
    Meteor.call('flights.insert', {flight});
  };

  handleUpdate = (flightId, flight) => {
    event.preventDefault();
    Meteor.call('flights.update', {flightId, flight});
  };

  handleDelete = (flightId) => {
    Meteor.call('flights.remove', {flightId});
  };

  handleBook = (flightId) => {
    Meteor.call('flights.book', {flightId});
  };

  startEditing = (flight) => {
    this.setState({editingFlight: flight});
  };

  cancelEditing = () => {
    this.setState({editingFlight: null});
  };

  updateSearch = (model) => {
    this.setState({searchParams: model});
  };

  renderFlightForm() {
    return !this.props.currentUser || !Roles.userIsInRole(this.props.currentUser, 'managers') ? ''
      : <FlightForm currentUser={this.props.currentUser}
                    handleCreate={this.handleCreate} handleUpdate={this.handleUpdate}
                    editingFlight={this.state.editingFlight} cancelEditing={this.cancelEditing}/>;
  }

  render() {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <FlightsFilterForm currentUser={this.props.currentUser} handleSubmit={this.updateSearch}/>
          {this.renderFlightForm()}
          <FlightList currentUser={this.props.currentUser} params={this.state.searchParams}
                      startEditing={this.startEditing} handleDelete={this.handleDelete}
                      handleBook={this.handleBook}/>
        </div>
      </div>
    );
  }
}

App = createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, App);

export default App;
