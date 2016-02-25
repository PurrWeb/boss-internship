import RotaChartInner from "./rota-chart-inner"
import React, { Component } from "react"
import ReactDOM from "react-dom"
import calculateChartBoundaries from "./calculate-chart-boundaries"

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
            rotaShifts={this.props.rotaShifts}
            startTime={chartBoundaries.start}
            endTime={chartBoundaries.end}
            staff={this.props.staff}
            updateStaffToPreview={this.props.updateStaffToPreview}
            updateStaffToShow={this.props.updateStaffToShow} />
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

        if (staffToPreview !== null) {
            d3.selectAll(".rota-chart__shift").classed("rota-chart__previewed-staff", function(bar){
                return bar.originalShiftObject.staff_member.id === staffToPreview;
            });
        }

        if (staffToShow !== null) {
            d3.selectAll(".rota-chart__shift").classed("rota-chart__selected-staff", function(bar){
                return bar.originalShiftObject.staff_member.id === staffToShow;
            });
        }

    }
}