import React from 'react';
import moment from 'moment';
import Formsy from 'formsy-react';
import {Row, Col, Button} from 'react-bootstrap';
import _ from 'underscore';

import {FormsyDateTimeInput, FormsyInput} from './FormsyInputs';

Formsy.addValidationRule('isDatetime', function (values, value) {
  const now = new Date();
  return !value || moment(value).isAfter(now);
});

Formsy.addValidationRule('isNotEmptyString', function (values, value) {
  return !!value.trim();
});

class FlightForm extends React.Component {

  static propTypes = {
    editingFlight: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      _id: '', canSubmit: false, canReset: false,
      origin: '',
      destination: '',
      departure: '',
      arrival: '',
      airline: '',
      aircraft: '',
      flightNumber: '',
      availability: '',
      price: '',
    };
    this.dateFormat = "DD MMMM YYYY";
    this.timeFormat = "HH:mm";
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  };

  disableButton = () => {
    this.setState({canSubmit: false});
  };

  handleChange = (model) => {
    this.setState({canReset: this.editingMode() || !_.every(_.values(model), v => !v)});
  };

  handleSubmit = (model) => {
    model.departure = moment(model.departure).toDate();
    model.arrival = moment(model.arrival).toDate();
    model.availability = model.availability * 1;
    model.price = model.price * 1;
    const flight = _.omit(model, '_id');
    if(this.editingMode()) {
      this.props.handleUpdate(model._id, flight);
    } else {
      this.props.handleCreate(flight);
    }
    this.resetForm();
  };

  resetForm() {
    this.refs.form.reset();
    this.props.cancelEditing();
    this.setState({canSubmit: false, canReset: false});
  }

  editingMode() {
    return !!this.props.editingFlight;
  }

  getFormValue(name) {
    return this.props.editingFlight ? this.props.editingFlight[name] : this.state[name];
  }

  render() {
    return (
      <Formsy.Form ref="form" className="form-horizontal meal-form" onChange={this.handleChange}
                   onValid={this.enableButton} onInvalid={this.disableButton} onValidSubmit={this.handleSubmit}>
        <Row>
          <Col lg={3} sm={3}>
            <FormsyInput type="text" name="origin" value={this.getFormValue('origin')}
                         placeholder="Origin" required/>
          </Col>
          <Col lg={3} sm={3}>
            <FormsyInput type="text" name="destination" value={this.getFormValue('destination')}
                         placeholder="Destination" required/>
          </Col>
          <Col lg={3} sm={3}>
            <FormsyDateTimeInput name="departure"
                                 dateFormat={this.dateFormat}
                                 timeFormat={this.timeFormat}
                                 inputProps={{placeholder: "Departure time"}}
                                 value={this.getFormValue('departure') && moment(this.getFormValue('departure'))
                  .format([this.dateFormat, this.timeFormat].join(" "))}
                                 isValidDate={(current) => current.isAfter(new Date())}
                                 validations="isDatetime" required/>
          </Col>
          <Col lg={3} sm={3}>
            <FormsyDateTimeInput name="arrival"
                                 dateFormat={this.dateFormat}
                                 timeFormat={this.timeFormat}
                                 inputProps={{placeholder: "Arrival time"}}
                                 value={this.getFormValue('arrival') && moment(this.getFormValue('arrival'))
                  .format([this.dateFormat, this.timeFormat].join(" "))}
                                 isValidDate={(current) => current.isAfter(new Date())}
                                 validations="isDatetime" required/>
          </Col>
        </Row>
        <Row>
          <Col lg={2} sm={2}>
            <FormsyInput type="text" name="airline" value={this.getFormValue('airline')}
                         placeholder="Airline" required/>
          </Col>
          <Col lg={2} sm={2}>
            <FormsyInput type="text" name="aircraft" value={this.getFormValue('aircraft')}
                         placeholder="Aircraft" required/>
          </Col>
          <Col lg={2} sm={2}>
            <FormsyInput type="text" name="flightNumber" value={this.getFormValue('flightNumber')}
                         placeholder="Flight Number" required/>
          </Col>
          <Col lg={2} sm={2}>
            <FormsyInput type="text" name="availability" value={this.getFormValue('availability')}
                         placeholder="Availability" validations="isInt" required/>
          </Col>
          <Col lg={2} sm={2}>
            <FormsyInput type="text" name="price" value={this.getFormValue('price')}
                         placeholder="Price" validations="isInt" required/>
          </Col>
          <Col lg={1} sm={1}>
            <Button bsStyle="success" type="submit" disabled={!this.state.canSubmit}>
              {this.editingMode() ? "Save" : "Create"}
            </Button>
          </Col>
          <Col lg={1} sm={1}>
            <Button type="button" onClick={this.resetForm.bind(this)} disabled={!this.state.canReset}>
              {this.editingMode() ? "Cancel" : "Reset"}
            </Button>
          </Col>
          <Col lg={1} sm={1}>
            <FormsyInput type="hidden" name="_id" value={this.getFormValue('_id')}/>
          </Col>
        </Row>
      </Formsy.Form>
    );
  }
}

export default FlightForm;
