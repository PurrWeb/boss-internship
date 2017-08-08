// Score "gauge" chart http://codepen.io/orlovmax/pen/RpXrbY

// To make it run, just pass the next data in chart markup:
// - unique element `ID`, i.e id="cleanliness-score"
// - `data-id`, that equal to element's ID, i.e data-id="cleanliness-score"
// - `data-current` - chart current score, i.e data-current="55"
// - `data-total` - chart total score, i.e data-total="100"
// - `data-size` - chart size (px). By default it equals 250, i.e data-size="250"

// ...and pass chart classname to the scharts variable in JS, like this `var scharts = document.getElementsByClassName('boss-chart-score');`

// Markup example
// <div id="cleanliness-score" class="boss-chart-score"
//   data-id="cleanliness-score"
//   data-current="55"
//   data-total="100"
//   data-size="250"></div>

// This code will create a chart with a colored circle, number, predefined label ("SCORE"), pointer and score information.

'use strict';

var scharts = document.getElementsByClassName('boss-chart-score');

function ScoreChart(placeholderName, configuration) {
  this.placeholderName = placeholderName;

  var self = this; // for internal d3 functions

  this.configure = function (configuration) {
    this.config = configuration;

    this.config.size = configuration.size || 250;

    this.config.radius = this.config.size * 0.5;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 1.7;

    this.config.failColor = configuration.failColor || '#de7575';
    this.config.successColor = configuration.successColor || '#5cac41';

    this.config.current = configuration.current;
    this.config.total = configuration.total;

    // Chart score/percentage math
    this.config.scorePercentage = this.config.current * (100 / this.config.total);
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

    for (var index in this.config.failZones) {
      this.drawBand(this.config.failZones[index].from, this.config.failZones[index].to, self.config.failColor);
    }

    for (index in this.config.successZones) {
      this.drawBand(this.config.successZones[index].from, this.config.successZones[index].to, self.config.successColor);
    }

    // Create chart graph information
    var chartInfoContainer = this.graph.append('svg:g').attr('class', 'boss-chart__info');
    var chartInfoNumber = chartInfoContainer.append('svg:text').attr('class', 'boss-chart__info-number');

    var numberFontSize = Math.round(this.config.size / 3.5);
    var labelFontSize = Math.round(this.config.size / 9);

    var scorePercentage = Math.round((this.config.current/this.config.total) * 100);

    chartInfoNumber
      .text(scorePercentage)
      .attr('x', this.config.cx)
      .attr('y', this.config.cy + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', numberFontSize + 'px')
      .style('line-height', '1')
      .style('font-weight', '600');

    if(this.config.current <= this.config.breakpoint) {
      chartInfoNumber.style('fill', this.config.failColor);

    } else if(this.config.current > this.config.breakpoint) {
      chartInfoNumber.style('fill', this.config.successColor);
    }

    // Create chart score
    var scoreContainer = chart.append('div').attr('class', 'boss-chart__score');
    var scoreLabel = scoreContainer.append('p').attr('class', 'boss-chart__score-label');
    var scoreValue = scoreContainer.append('p').attr('class', 'boss-chart__score-value');
    var scoreCurrent = scoreValue.append('span').attr('class', 'boss-chart__score-current');
    var scoreDelimiter = scoreValue.append('span').text(' / ');
    var scoreTotal = scoreValue.append('span').attr('class', 'boss-chart__score-total');

    scoreLabel
      .text('Score')

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
        .startAngle(this.currentToRadians(start))
        .endAngle(this.currentToRadians(end))
        .innerRadius(0.73 * this.config.radius)
        .outerRadius(0.90 * this.config.radius))
      .attr('transform', function () {
        return 'translate(' + self.config.cx + ', ' + self.config.cy + ') rotate(220)';
      });


    for (var setMarker = 0; setMarker <= 0; setMarker += 1) {

      if(this.config.scorePercentage <= 8) {
        this.graph.append('svg:path')
          .style('fill', this.config.failColor)
          .attr('d', d3.svg.arc()
            .startAngle(this.currentToRadians(0))
            .endAngle(this.currentToRadians(0) + 0.7)
            .innerRadius(0.65 * this.config.radius)
            .outerRadius(0.97 * this.config.radius))
          .attr('transform', function () {
            return 'translate(' + self.config.cx + ', ' + self.config.cy + ') rotate(220)';
          });
      } else if(this.config.scorePercentage > 8 && this.config.scorePercentage <= this.config.breakpoint) {
        this.graph.append('svg:path')
          .style('fill', this.config.failColor)
          .attr('d', d3.svg.arc()
            .startAngle(this.currentToRadians(this.config.scorePercentage) - 0.35)
            .endAngle(this.currentToRadians(this.config.scorePercentage)+ 0.35)
            .innerRadius(0.65 * this.config.radius)
            .outerRadius(0.97 * this.config.radius))
          .attr('transform', function () {
            return 'translate(' + self.config.cx + ', ' + self.config.cy + ') rotate(220)';
          });
      } else if(this.config.scorePercentage > this.config.breakpoint && this.config.scorePercentage < 92) {
        this.graph.append('svg:path')
          .style('fill', this.config.successColor)
          .attr('d', d3.svg.arc()
            .startAngle(this.currentToRadians(this.config.scorePercentage) - 0.35)
            .endAngle(this.currentToRadians(this.config.scorePercentage)+ 0.35)
            .innerRadius(0.65 * this.config.radius)
            .outerRadius(0.97 * this.config.radius))
          .attr('transform', function () {
            return 'translate(' + self.config.cx + ', ' + self.config.cy + ') rotate(220)';
          });
      } else if(this.config.scorePercentage >= 92) {
        this.graph.append('svg:path')
          .style('fill', this.config.successColor)
          .attr('d', d3.svg.arc()
            .startAngle(this.currentToRadians(100) - 0.7)
            .endAngle(this.currentToRadians(100))
            .innerRadius(0.65 * this.config.radius)
            .outerRadius(0.97 * this.config.radius))
          .attr('transform', function () {
            return 'translate(' + self.config.cx + ', ' + self.config.cy + ') rotate(220)';
          });
      }
    }
  };


  this.currentToDegrees = function (value) {
    return value / 100 * 280;
  };


  this.currentToRadians = function (value) {
    return this.currentToDegrees(value) * Math.PI / 180;
  };

  // initialization
  this.configure(configuration);
}

function newScoreChart(id, current, total, size, breakpoint) {

  var config = {
    size: undefined !== size ? size : 100,
    id: id,
    current: current,
    total: total,
    breakpoint: undefined !== breakpoint ? breakpoint : 50
  };


  config.failZones = [{
    from: 0,
    to: 0 + config.breakpoint
  }];
  config.successZones = [{
    from: 0 + config.breakpoint,
    to: 0 + 100
  }];

  var createScoreChart = new ScoreChart(config.id, config);
  createScoreChart.render();
}

function createScoreCharts() {
  Array.prototype.forEach.call(scharts, function (schart) {
    var data = schart.dataset;
    newScoreChart(data.id, data.current, data.total, data.size, data.breakpoint);
  });
}

function initializeScoreCharts() {
  createScoreCharts();
}
