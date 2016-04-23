import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire'

var App = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      freelancers: [],
      rate: 0,
      monthly: 0
    };
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase('https://hy-freelancers.firebaseio.com');
    this.bindAsArray(firebaseRef, "freelancers");
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.rate > 0 && this.state.monthly > 0) {
      this.firebaseRefs['freelancers'].push({
        rate: this.state.rate,
        monthly: this.state.monthly
      });
      this.setState({
        rate: 0,
        monthly: 0
      });
    } else {
      console.error("Zero is not a valid entry! Sorry, homes.");
    }
  },

  onRateChange: function(e) {
    this.setState({rate: e.target.value});
  },

  onMonthlyChange: function(e) {
    this.setState({monthly: e.target.value});
  },

  render: function() {
    return (
      <div>
        <h1>Freelancer Stats</h1>
        <DataTable freelancers={this.state.freelancers}/>

        <form onSubmit={this.handleSubmit}>
          <h2>DataForm</h2>
          <label htmlFor="rate">Rate</label>
          <input name="rate" id="rate" onChange={this.onRateChange}/>
          <label htmlFor="monthly">Monthly</label>
          <input name="monthly" id="monthly" onChange={this.onMonthlyChange}/>
          <input type="submit" name="submit" id="submit"/>
        </form>

      </div>
    )
  }
})

var DataTable = React.createClass({
  render() {
    var freelancers = this.props.freelancers.map(function (freelancer, index) {
      return (
        <DataRow
          key={index}
          rate={freelancer.rate}
          monthly={freelancer.monthly}/>
      )
    });
    console.log(freelancers);
    return (
      <div>
        <h2>DataTable</h2>
        {freelancers}
      </div>
    )
  }
})

var DataRow = React.createClass({
  render() {
    return (
      <p>{this.props.rate} - {this.props.monthly}</p>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'));
