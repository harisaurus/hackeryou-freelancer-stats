import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import Chart from 'chart.js';
var BarChart = require("react-chartjs").Bar;

var App = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      freelancers: [],
      rate: 0,
      monthly: 0,
      role: 'full'
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
        role: this.state.role,
        rate: this.state.rate,
        monthly: this.state.monthly
      });
      this.setState({
        rate: 0,
        monthly: 0,
        role: ''
      });
    } else {
      console.error("Not a valid entry! Sorry, homes.");
    }
  },

  onRoleChange: function(e) {
    this.setState({role: e.currentTarget.value});
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
          <label htmlFor="role">Role</label>
          <input type="radio" name="role" id="role" value="full" onChange={this.onRoleChange} checked={this.state.role === "full"} />Full-time
          <input type="radio" name="role" id="role" value="part" onChange={this.onRoleChange} checked={this.state.role === "part"}/>Part-time

          <label htmlFor="rate">Rate</label>
          <input name="rate" id="rate" onChange={this.onRateChange}/>

          <label htmlFor="monthly">Monthly</label>
          <input name="monthly" id="monthly" onChange={this.onMonthlyChange}/>

          <input type="submit" name="submit" id="submit"/>
        </form>

        <div className="chartWrapper">
          <div className="chartWrapper__title">Hourly Rates</div>
          <div className="chartWrapper__chart">
            <RateBarChart freelancers={this.state.freelancers}/>
          </div>
        </div>

        <div className="chartWrapper">
          <div className="chartWrapper__title">Average Monthly Revenue</div>
          <div className="chartWrapper__chart">
            <MonthlyBarChart freelancers={this.state.freelancers}/>
          </div>
        </div>

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
          role={freelancer.role}
          rate={freelancer.rate}
          monthly={freelancer.monthly}/>
      )
    });

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
      <p>{this.props.role} - {this.props.rate} - {this.props.monthly}</p>
    )
  }
})

var RateBarChart = React.createClass({
  render: function() {

    var chartData = {
      labels: ["$0-19", "$20-39", "$40-59", "$60-79", "$80-99", "$100-119", "$120-139", "$140-160"],
      datasets: [
        {
          fillColor: "#3964FE",
          strokeColor: "rgba(0,0,0,0)",
          pointColor: "rgba(0,0,0,0)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(0,0,0,0)",
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };

    var chartOptions = {
      scaleShowGridLines: false,
      responsive: true,
      barValueSpacing : 10,
      showTooltips: false
    };

    this.props.freelancers.forEach(function(freelancer, index) {
      var rateGroup = Math.floor(freelancer.rate / 20);
      chartData.datasets[0].data[rateGroup]++
    });

    return <BarChart data={chartData} options={chartOptions} width="700" height="300"/>
  }
});



var MonthlyBarChart = React.createClass({
  render: function() {

    var chartData = {
      labels: ["$0-1,000", "$1,000-2,000", "$2,000-3,000", "$3,000-4,000", "$4,000-5,000", "$5,000-6,000", "$6,000-7,000", "$7,000-8,000", "$8,000-9,000"],
      datasets: [
        {
          fillColor: "#3964FE",
          strokeColor: "rgba(0,0,0,0)",
          pointColor: "rgba(0,0,0,0)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(0,0,0,0)",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };

    var chartOptions = {
      scaleShowGridLines: false,
      responsive: true,
      barValueSpacing : 10,
      showTooltips: false
    };

    this.props.freelancers.forEach(function(freelancer, index) {
      var rateGroup = Math.floor(freelancer.monthly / 1000);
      chartData.datasets[0].data[rateGroup]++
    });

    return <BarChart data={chartData} options={chartOptions} width="700" height="300"/>
  }
});

// Chart.Scale.prototype.buildYLabels = function () {
//   this.yLabelWidth = 0;
// };

ReactDOM.render(<App/>, document.getElementById('app'));
