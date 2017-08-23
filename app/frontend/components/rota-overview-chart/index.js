import React, { Component } from "react"
import _ from "underscore"
import RotaDate from "~/lib/rota-date"
import utils from "~/lib/utils"
import moment from "moment"
import {renderTooltipInfoHtml, renderTooltipTimeHtml} from "./render-tooltip-html"
import RotaOverviewChartInner from "./rota-overview-chart-inner"

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MINUTES_PER_HOUR = 60;

export default class RotaOverviewChart extends Component {
    static propTypes = {
        shifts: React.PropTypes.array.isRequired,
        groups: React.PropTypes.arrayOf(React.PropTypes.shape({
            clientId: React.PropTypes.any.isRequired,
            color: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        })),
        staff: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date),
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired,
        getBreakdown: React.PropTypes.func.isRequired,
        granularity: React.PropTypes.number.isRequired
    }
    shouldComponentUpdate(nextProps, nextState){
        return !utils.deepEqualTreatingFunctionsAsStrings(
            nextProps,
            this.props
        );
    }
    render() {
        var self = this;
        var breakdown = this.props.getBreakdown();

        return <RotaOverviewChartInner
            chartData={this.getChartData(breakdown)}
            rotaDate={this.getRotaDate()}
            onElementClick={function(obj){
                self.props.onHoverShiftsChange(null);
                var data = self.getSelectionData(breakdown, obj);
                self.props.onSelectionShiftsChange(data);
            }}
            onElementMouseover={function(obj){
                var data = self.getSelectionData(breakdown, obj);
                self.props.onHoverShiftsChange(data);
            }}
            onElementMouseout={function(obj){
                self.props.onHoverShiftsChange(null);
            }}
            tooltipInfoGenerator={
                function(obj) {
                    var groupsById = utils.indexByClientId(self.props.groups);
                    var selectedGroupTitle = obj.series[0].key;
                    var date = breakdown[obj.index].date;
                    var breakdownAtPoint = _(breakdown).find(
                        (point) => point.date.valueOf() === date.valueOf()
                    );
                    var selectedGroupId = _(groupsById).find({name: selectedGroupTitle}).clientId;

                    var html = renderTooltipInfoHtml({
                        shiftsByGroupId: breakdownAtPoint.shiftsByGroup,
                        selectedGroupId,
                        groupsById,
                        shiftDates:  self.getSelectionData(breakdown, obj)
                    });
                    return html;
                }}
            tooltipTimeGenerator={
                function(obj) {
                  var groupsById = utils.indexByClientId(self.props.groups);
                  var selectedGroupTitle = obj.series[0].key;

                  var selectedGroupId = _(groupsById).find({name: selectedGroupTitle}).clientId;

                  var html = renderTooltipTimeHtml({
                      selectedGroupId,
                      groupsById,
                      shiftDates:  self.getSelectionData(breakdown, obj),
                      staff: self.props.staff
                  });
                  return html;
                }}
            />
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota});
    }
    getSelectionData(breakdown, obj){
        var seriesName = obj.data.key;
        var index = obj.index;

        var group = this.getGroupsByName()[seriesName];
        var shifts = breakdown[index].shiftsByGroup[group.clientId];
        return {
            shifts,
            groupId: group.clientId,
            date: breakdown[index].date
        };
    }
    getGroupsByName(){
        return _(this.props.groups).indexBy("name");
    }
    getChartData(breakdown){
        var rotaDate = this.getRotaDate();
        var groups = this.props.groups;
        var series = [];
        var granularity = this.props.granularity;

        groups.forEach(function(group){
            var values = _(breakdown).map(function(item){
                return {
                    value: item.shiftsByGroup[group.clientId].length,
                    label: item.date.valueOf()
                }
            });
            series.push({
                key: group.name,
                values: values,
                color: group.color,
                pointStart: rotaDate.startTime.valueOf(),
                pointInterval: granularity * MILLISECONDS_PER_MINUTE
            });
        });
        return series;
    }
}
