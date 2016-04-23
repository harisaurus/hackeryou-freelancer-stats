import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire'
var BarChart = require("react-chartjs").Bar;

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

        <RateBarChart freelancers={this.state.freelancers}/>

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

var RateBarChart = React.createClass({

  render: function() {
    var chartData = {
      labels: ["0 - 19", "20 - 39", "40 - 59", "60 - 79", "80 - 99", "100 - 119", "120 - 140"],
      datasets: [
        {
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: [0, 0, 0, 0]
        }
      ]
    }
    var chartOptions = {
      scaleShowHorizontalLines: false,
      scaleShowVerticalLines: false,
      responsive: true
    };

    this.props.freelancers.forEach(function(freelancer, index) {
      var rateGroup = Math.floor(freelancer.rate / 20);
      chartData.datasets[0].data[rateGroup]++
    });


    return <BarChart data={chartData} options={chartOptions} width="700" height="250"/>
  }
});

ReactDOM.render(<App/>, document.getElementById('app'));
