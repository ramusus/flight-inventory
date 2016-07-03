import React from 'react';
import Formsy from 'formsy-react';
import {Row, Col, Button} from 'react-bootstrap';
import moment from 'moment';
import _ from 'underscore';

import {FormsyDateTimeInput, FormsyInput} from './FormsyInputs';

class FlightFilterForm extends React.Component {

  constructor(props) {
    super(props);
    this.dateFormat = "DD MMMM YYYY";
    this.state = {origin: '', destination: '', departure: '', airline: '', passengers: '', canReset: false};
  }

  handleChange = (model) => {
    // if model is event -> no need to submit
    if (model.preventDefault) {
      return
    }
    const canReset = model.origin || model.destination || model.departure || model.airline || model.passengers;
    this.setState({canReset: canReset});

    if (model.departure) {
      model.departure = moment(model.departure).toDate();
    }
    //// convert hours to UTC
    //const tzShift = new Date().getTimezoneOffset() / 60;
    //if (model.departure) {
    //  model.departure = parseInt(model.departure) + tzShift;
    //}
    this.props.handleSubmit(model);
  };

  resetForm = () => {
    this.setState({canReset: false});
    this.refs.form.reset();
    this.props.handleSubmit({});
  };

  render() {
    return (
      <Formsy.Form ref="form" className="form-horizontal flight-filters"
                   onChange={this.handleChange} onValidSubmit={this.handleChange}>
        <div className="panel-body">
          <Row>
            <Col lg={1} sm={1}>Search:</Col>
            <Col lg={2} sm={2}>
              <FormsyInput type="text" name="origin" value={this.state.origin} placeholder="Origin" required/>
            </Col>
            <Col lg={2} sm={2}>
              <FormsyInput type="text" name="destination" value={this.state.destination} placeholder="Destination"
                           required/>
            </Col>
            <Col lg={2} sm={2}>
              <FormsyDateTimeInput name="departure" dateFormat={this.dateFormat} timeFormat={false}
                                   inputProps={{placeholder: "Date"}} value={this.state.departure}
                                   isValidDate={(current) => current.isAfter(new Date())}
                                   validations="isDatetime" closeOnSelect={true} required/>
            </Col>
            <Col lg={2} sm={2}>
              <FormsyInput type="text" name="airline" value={this.state.airline}
                           placeholder="Airline"/>
            </Col>
            <Col lg={2} sm={2}>
              <FormsyInput type="text" name="passengers" value={this.state.passengers}
                           placeholder="Passengers" validations="isInt"/>
            </Col>
            <Col lg={1} sm={1}>
              <Button bsStyle="success" type="button" onClick={this.resetForm} disabled={!this.state.canReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </div>
      </Formsy.Form>
    );
  }
}

export default FlightFilterForm;
