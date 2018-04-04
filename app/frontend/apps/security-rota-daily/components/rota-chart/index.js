import RotaChartInner from "./rota-chart-inner"
import React, { Component } from "react"
import ReactDOM from "react-dom"
import calculateChartBoundaries from "./calculate-chart-boundaries"
import _ from "underscore"

/**
This is a wrapper around the D3 rota chart that handles small state changes
like hover highlighting that don't work well with a full re-render of the chart
(due to e.g. mouseenter being re-triggered when a bar is replaced while under the cursor
... which in turn would cause a re-render).
 */
export default class RotaChart extends Component {
    constructor(props){
        super(props);
    }
    render(){
        var chartBoundaries = calculateChartBoundaries(this.props.rotaShifts);

        return <RotaChartInner
            rotaShifts={_(this.props.rotaShifts).sortBy((item) => item.starts_at)}
            startTime={chartBoundaries.start}
            endTime={chartBoundaries.end}
            staff={this.props.staff}
            staffTypes={this.props.staffTypes}
            onShiftClick={this.props.onShiftClick}
            updateStaffToShow={this.props.updateStaffToShow}
            getShiftColor={this.props.getShiftColor} />
    }
    componentDidMount() {
        this.applyAdditionalChartProps();
    }
    componentDidUpdate(prevProps, prevState){
        this.applyAdditionalChartProps();
    }
    applyAdditionalChartProps(){
        var el = d3.select(ReactDOM.findDOMNode(this));

        var {staffToPreview, staffToShow} = this.props;

        d3.selectAll(".rota-chart__shift").classed("rota-chart__previewed-staff", function(bar){
            return bar.originalShiftObject.staff_member.clientId === staffToPreview;
        });

        d3.selectAll(".rota-chart__shift").classed("rota-chart__selected-staff", function(bar){
            return bar.originalShiftObject.staff_member.clientId === staffToShow;
        });

    }
}
