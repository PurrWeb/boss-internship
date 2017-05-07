// Completeness chart http://codepen.io/orlovmax/pen/dvxGYK

// To make it run, just pass the next data in chart markup:
// - unique element `ID`, i.e id="questionnaire-completeness"
// - `data-id`, that equal to element's ID, i.e data-id="questionnaire-completeness"
// - `data-current` - unanswered questions count, i.e data-current="20"
// - `data-total` - total questions count, i.e data-total="100"
// - `data-size` - chart size (px). By default it equals 70, i.e data-size="70"

// ...and pass chart classname to the `ccharts` variable in JS, like this `var ccharts = document.getElementsByClassName('boss-chart-questionnaire');`

// Markup example
// <div id="questionnaire-completeness" class="boss-chart-questionnaire"
//   data-id="questionnaire-completeness"
//   data-current="20"
//   data-total="100"
//   data-size="70"></div>

// This code will create a chart with a colored circle, number and score information.


'use strict';

var ccharts = document.getElementsByClassName('boss-chart-questionnaire');

function CompletenessChart(placeholderName, configuration) {
  this.placeholderName = placeholderName;

  var self = this; // for internal d3 functions

  this.configure = function (configuration) {
    this.config = configuration;

    this.config.size = configuration.size || 70;

    this.config.radius = this.config.size * 0.5;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;

    this.config.neutralColor = configuration.neutralColor || '#fafafa';
    this.config.failColor = configuration.failColor || '#de7575';
    this.config.successColor = configuration.successColor || '#5cac41';

    this.config.current = configuration.current;
    this.config.total = configuration.total;

    this.config.scorePercentage = this.config.current * (100 / this.config.total);
    this.config.scorePercentageInverted = 100 - (this.config.current * (100 / this.config.total));
  };

  this.render = function () {
    var chartContainer = d3.select('#' + this.config.id);
    var chart = chartContainer.append('div').attr('class', 'boss-chart boss-chart_role_questionnaire');
    var chartInner = chart.append('div').attr('class', 'boss-chart__inner');


    // Create chart svg graph
    this.graph = chartInner
      .append('svg:svg')
      .attr('class', 'boss-chart__graph')
      .attr('width', this.config.size)
      .attr('height', this.config.size);

    for (var index in this.config.neutralZones) {
      this.drawBand(this.config.neutralZones[index].from, this.config.neutralZones[index].to, self.config.neutralColor);
    }

    for (index in this.config.progressZones) {
      if(this.config.scorePercentageInverted < this.config.breakpoint) {
        this.drawBand(this.config.progressZones[index].from, this.config.progressZones[index].to, self.config.failColor);
      } else if(this.config.scorePercentageInverted == this.config.breakpoint) {
        this.drawBand(this.config.progressZones[index].from, this.config.progressZones[index].to, self.config.successColor);
      }
    }


    // Create chart graph information
    var chartInfoContainer = this.graph.append('svg:g').attr('class', 'boss-chart__info');
    var chartInfoNumber = chartInfoContainer.append('svg:text').attr('class', 'boss-chart__info-number');

    var numberFontSize = Math.round(this.config.size / 5);

    chartInfoNumber
      .text(Math.round(this.config.scorePercentageInverted) + '%')
      .attr('x', this.config.cx)
      .attr('y', this.config.cy + numberFontSize / 4)
      .attr('text-anchor', 'middle')
      .style('font-size', numberFontSize + 'px')
      .style('line-height', '1')
      .style('font-weight', '600');

    if(this.config.scorePercentageInverted < this.config.breakpoint) {
      chartInfoNumber.style('fill', this.config.failColor);

    } else if(this.config.scorePercentageInverted == this.config.breakpoint) {
      chartInfoNumber.style('fill', this.config.successColor);
    }

    // Create chart score
    var scoreContainer = chart.append('div').attr('class', 'boss-chart__score');
    var scoreValue = scoreContainer.append('p').attr('class', 'boss-chart__score-value');
    var scoreCurrent = scoreValue.append('span').attr('class', 'boss-chart__score-current');
    var scoreDelimiter = scoreValue.append('span').text(' of ');
    var scoreTotal = scoreValue.append('span').attr('class', 'boss-chart__score-total');
    var scoreLabel = scoreValue.append('span').text(' Questions unanswered');

    scoreCurrent
      .text(this.config.current)

    scoreTotal
      .text(this.config.total)
  };


  this.drawBand = function (start, end, color) {
    if (0 >= end - start) {
      return;
    }

    this.graph.append('svg:path')
      .style('fill', color)
      .attr('d', d3.svg.arc()
        .startAngle(this.valueToRadians(start))
        .endAngle(this.valueToRadians(end))
        .innerRadius(0.73 * this.config.radius)
        .outerRadius(0.90 * this.config.radius))
      .attr('transform', function () {
        return 'translate(' + self.config.cx + ', ' + self.config.cy + ')';
      });
  };


  this.valueToDegrees = function (value) {
    return value / 100 * 360;
  };


  this.valueToRadians = function (value) {
    return this.valueToDegrees(value) * Math.PI / 180;
  };

  // initialization
  this.configure(configuration);
}

function newCompletenessChart(id, current, total, size, breakpoint) {

  var config = {
    size: undefined !== size ? size : 70,
    id: id,
    current: current,
    total: total,
    breakpoint: undefined !== breakpoint ? breakpoint : 100
  };

  config.neutralZones = [{
    from: 0 + 100 - (config.current * (100 / config.total)),
    to: 100
  }];
  config.progressZones = [{
    from: 0,
    to: 0 + 100 - (config.current * (100 / config.total))
  }];

  var createCompletenessChart = new CompletenessChart(config.id, config);
  createCompletenessChart.render();
}

function createCompletenessCharts() {
  Array.prototype.forEach.call(ccharts, function (cchart) {
    var data = cchart.dataset;
    newCompletenessChart(data.id, data.current, data.total, data.size, data.breakpoint);
  });
}

function initializeCompletenessCharts() {
  createCompletenessCharts();
}
