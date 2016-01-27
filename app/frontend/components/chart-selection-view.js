import React from "react"

/**
    To be used to show details for the part of a chart that the user is hovering
    over or has clicked on.
    When no preview component is supplied the selectionComponent shows. Otherwise
    a low-opacity version of the preview component is shown.
*/
export default class ChartSelectionView extends React.Component {
    static propTypes = {
        previewComponent: React.PropTypes.object,
        selectionComponent: React.PropTypes.object
    }
    render(){
        var hasPreviewComponent = this.props.previewComponent !== null && this.props.previewComponent !== undefined;
        return <div style={{position: "relative"}}>
            <div
                className="chart-selection-view__selected-shift-editor"
                style={{opacity: hasPreviewComponent ? "0": "1"}}>
                {this.props.selectionComponent}
            </div>
            <div className="chart-selection-view__preview-shift-editor">
                {this.props.previewComponent}
            </div>
        </div>
    }
}