import RotaChartInner from "./rota-chart-inner"
import React, { Component } from "react"
import ReactDOM from "react-dom"

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
        return <RotaChartInner
            rotaShifts={this.props.rotaShifts}
            startTime={this.props.startTime}
            endTime={this.props.endTime}
            staff={this.props.staff}
            updateShiftToPreview={this.props.updateShiftToPreview}
            updateShiftToShow={this.props.updateShiftToShow} />
    }
    componentDidMount() {
        this.applyAdditionalChartProps();
    }
    componentDidUpdate(prevProps, prevState){
        this.applyAdditionalChartProps();
    }
    applyAdditionalChartProps(){
        var el = d3.select(ReactDOM.findDOMNode(this));

        var shiftToPreview = this.props.shiftToPreview;
        if (shiftToPreview !== null) {
            d3.selectAll(".rota-chart__shift").classed("rota-chart__previewed-shift", function(bar){
                return bar.originalShiftObject.id === shiftToPreview.id;
            });
        }

        var shiftToShow = this.props.shiftToShow;
        if (shiftToShow !== null) {
            d3.selectAll(".rota-chart__shift").classed("rota-chart__selected-shift", function(bar){
                return bar.originalShiftObject.id === shiftToShow.id;
            });
        }

    }
}