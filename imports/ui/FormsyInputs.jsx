import React from 'react';
import Formsy from 'formsy-react';
import DateTime from 'react-datetime';
import {Row, Col, FormControl, Button} from 'react-bootstrap';

export const FormsyDateTimeInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (v) {
    this.setValue(v);
  },
  render: function () {
    const className = this.showRequired() ? 'required' : (this.showError() ? 'has-error' : null);
    const errorMessage = this.getErrorMessage();
    return (
      <div className={className}>
        <DateTime {...this.props} onChange={this.changeValue} value={this.getValue()}/>
        <span>{errorMessage}</span>
      </div>
    );
  }
});

export const FormsyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    const className = this.showRequired() ? 'required' : (this.showError() ? 'has-error' : null);
    const errorMessage = this.getErrorMessage();
    return (
      <div className={className}>
        <FormControl {...this.props} onChange={this.changeValue} value={this.getValue()}/>
        <span>{errorMessage}</span>
      </div>
    );
  }
});
