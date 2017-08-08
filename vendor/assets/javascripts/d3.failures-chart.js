// Failures indicator chart http://codepen.io/orlovmax/pen/peMgjg

// To make it run, just pass the next data in chart markup:
// - unique element `ID`, i.e id="safety-failures"
// - `data-id`, that equal to element's ID, i.e data-id="safety-failures"
// - `data-failures` - chart failures count, i.e data-failures="3"
// - `data-current` - chart current score, i.e data-current="55"
// - `data-total` - chart total score, i.e data-total="100"
// - `data-size` - chart size (px). By default it equals 250, i.e data-size="250"

// ...and pass chart classname to the `fcharts` variable in JS, like this `var fcharts = document.getElementsByClassName('boss-chart-failures');`

// Markup example
// <div id="safety-failures" class="boss-chart-failures"
//   data-id="safety-failures"
//   data-failures="3"
//   data-current="55"
//   data-total="100"
//   data-size="250"></div>

// This code will create a chart with a colored circle, number, predefined label ("INSTANT FAILURES") and scored questions information.

'use strict';

var fcharts = document.getElementsByClassName('boss-chart-failures');

function FailureChart(placeholderName, configuration) {
  this.placeholderName = placeholderName;

  var self = this; // for internal d3 functions

  this.configure = function (configuration) {
    this.config = configuration;

    this.config.size = configuration.size || 250;

    this.config.radius = this.config.size * 0.5;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;

    this.config.failColor = configuration.failColor || '#de7575';
    this.config.successColor = configuration.successColor || '#5cac41';

    this.config.current = configuration.current;
    this.config.total = configuration.total;
    this.config.failures = configuration.failures;
  };

  this.render = function () {
    var chartContainer = d3.select('#' + this.config.id);
    var chart = chartContainer.append('div').attr('class', 'boss-chart');
    var chartInner = chart.append('div').attr('class', 'boss-chart__inner');


    // Create chart svg graph
    this.graph = chartInner
      .append('svg:svg')
      .attr('class', 'boss-chart__graph')
      .attr('width', this.config.size)
      .attr('height', this.config.size);

    for (var index in this.config.circle) {
      if(this.config.failures > 0) {
        this.drawBand(this.config.circle[index].from, this.config.circle[index].to, self.config.failColor);
      } else {
        this.drawBand(this.config.circle[index].from, this.config.circle[index].to, self.config.successColor);
      }
    }

    // Create chart graph information
    var chartInfoContainer = this.graph.append('svg:g').attr('class', 'boss-chart__info');
    var chartInfoNumber = chartInfoContainer.append('svg:text').attr('class', 'boss-chart__info-number');
    var chartInfoLabel = chartInfoContainer.append('svg:text').attr('class', 'boss-chart__info-label');

    var numberFontSize = Math.round(this.config.size / 3.5);
    var labelFontSize = Math.round(this.config.size / 17);

    chartInfoNumber
      .text(Math.round(this.config.failures))
      .attr('x', this.config.cx)
      .attr('y', this.config.cy)
      .attr('text-anchor', 'middle')
      .style('font-size', numberFontSize + 'px')
      .style('line-height', '1')
      .style('font-weight', '600');

    chartInfoLabel
      .text("INSTANT FAILURES")
      .attr('x', this.config.cx)
      .attr('y', this.config.cy + labelFontSize * 2)
      .attr('text-anchor', 'middle')
      .style('font-size', labelFontSize + 'px')
      .style('line-height', '1')
      .style('font-weight', '400')
      .style('text-transform', 'uppercase');

    if(this.config.failures > 0) {
      chartInfoNumber.style('fill', this.config.failColor);
      chartInfoLabel.style('fill', this.config.failColor);

    } else {
      chartInfoNumber.style('fill', this.config.successColor);
      chartInfoLabel.style('fill', this.config.successColor);
    }


    if (this.config.total > 0) {
      // Create chart score
      var scoreContainer = chart.append('div').attr('class', 'boss-chart__score');
      var scoreLabel = scoreContainer.append('p').attr('class', 'boss-chart__score-label');
      var scoreValue = scoreContainer.append('p').attr('class', 'boss-chart__score-value');
      var scoreCurrent = scoreValue.append('span').attr('class', 'boss-chart__score-current');
      var scoreDelimiter = scoreValue.append('span').text(' / ');
      var scoreTotal = scoreValue.append('span').attr('class', 'boss-chart__score-total');

      scoreLabel
        .text('Scored questions')

      scoreCurrent
        .text(this.config.current)

      scoreTotal
        .text(this.config.total)
    }
  };


  this.drawBand = function (start, end, color) {
    if (0 >= end - start) {
      return;
    }

    this.graph.append('svg:path')
      .style('fill', color)
      .attr('d', d3.svg.arc()
        .startAngle(this.currentToRadians(start))
        .endAngle(this.currentToRadians(end))
        .innerRadius(0.73 * this.config.radius)
        .outerRadius(0.90 * this.config.radius))
      .attr('transform', function () {
        return 'translate(' + self.config.cx + ', ' + self.config.cy + ')';
      });
  };


  this.currentToDegrees = function (value) {
    return value / 100 * 360;
  };


  this.currentToRadians = function (value) {
    return this.currentToDegrees(value) * Math.PI / 180;
  };

  // initialization
  this.configure(configuration);
}

function newFailureChart(id, current, total, size, failures, breakpoint) {

  var config = {
    size: undefined !== size ? size : 100,
    id: id,
    current: current,
    total: total,
    failures: failures,
    breakpoint: undefined !== breakpoint ? breakpoint : 50
  };


  config.circle = [{
    from: 0,
    to: 360
  }];

  var createFailureChart = new FailureChart(config.id, config);
  createFailureChart.render();
}

function createFailureCharts() {
  Array.prototype.forEach.call(fcharts, function (fchart) {
    var data = fchart.dataset;
    newFailureChart(data.id, data.current, data.total, data.size, data.failures, data.breakpoint);
  });
}

function initializeFailureCharts() {
  createFailureCharts();
}
