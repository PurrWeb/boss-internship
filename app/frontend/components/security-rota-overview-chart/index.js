import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'underscore';
import RotaDate from '~/lib/rota-date';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import {
  renderTooltipInfoHtml,
  renderTooltipTimeHtml,
} from './render-tooltip-html';
import RotaOverviewChartInner from './rota-overview-chart-inner';

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MINUTES_PER_HOUR = 60;

export default class RotaOverviewChart extends Component {
  static propTypes = {
    shifts: PropTypes.array.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        color: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    staff: PropTypes.array.isRequired,
    dateOfRota: PropTypes.instanceOf(Date),
    breakdown: PropTypes.array.isRequired,
    granularity: PropTypes.number.isRequired,
  };

  render() {
    var self = this;
    var breakdown = this.props.breakdown;

    return (
      <RotaOverviewChartInner
        chartData={this.getChartData(breakdown)}
        rotaDate={this.getRotaDate()}
        onElementClick={function(obj) {
          var data = self.getSelectionData(breakdown, obj);
        }}
        onElementMouseover={function(obj) {
          var data = self.getSelectionData(breakdown, obj);
        }}
        onElementMouseout={function(obj) {}}
        tooltipInfoGenerator={function(obj) {
          const groupsById = self.props.groups.reduce((acc, group) => {
            acc[group.id] = group;
            return acc;
          }, {});

          var selectedGroupTitle = obj.series[0].key;

          var date = breakdown[obj.index].date;
          var breakdownAtPoint = _(breakdown).find(
            point => point.date.valueOf() === date.valueOf(),
          );
          var selectedGroupId = _(groupsById).find({ name: selectedGroupTitle })
            .id;

          var html = renderTooltipInfoHtml({
            shiftsByGroupId: breakdownAtPoint.shiftsByGroup,
            selectedGroupId,
            groupsById,
            shiftDates: self.getSelectionData(breakdown, obj),
          });
          return html;
        }}
        tooltipTimeGenerator={function(obj) {
          var groupsById = self.props.groups.reduce((acc, group) => {
            acc[group.id] = group;
            return acc;
          }, {});
          var selectedGroupTitle = obj.series[0].key;

          var selectedGroupId = _(groupsById).find({ name: selectedGroupTitle })
            .id;

          var html = renderTooltipTimeHtml({
            selectedGroupId,
            groupsById,
            shiftDates: self.getSelectionData(breakdown, obj),
            staff: self.props.staff,
          });
          return html;
        }}
        noData={'No Shifts currently rotaed'}
      />
    );
  }
  getRotaDate() {
    return new RotaDate({ dateOfRota: this.props.dateOfRota });
  }
  getSelectionData(breakdown, obj) {
    var seriesName = obj.data.key;
    var index = obj.index;

    var group = this.getGroupsByName()[seriesName];
    var shifts = breakdown[index].shiftsByGroup[group.id];
    return {
      shifts,
      groupId: group.id,
      date: breakdown[index].date,
    };
  }
  getGroupsByName() {
    return _(this.props.groups).indexBy('name');
  }
  getChartData(breakdown) {
    var rotaDate = this.getRotaDate();
    var groups = this.props.groups;
    var series = [];
    var granularity = this.props.granularity;

    groups.forEach(function(group) {
      var values = breakdown.map(function(item) {
        return {
          value: item.shiftsByGroup[group.id].length,
          label: item.date.valueOf(),
        };
      });
      series.push({
        key: group.name,
        values: values,
        color: group.color,
        pointStart: rotaDate.startTime.valueOf(),
        pointInterval: granularity * MILLISECONDS_PER_MINUTE,
      });
    });
    return series;
  }
}
