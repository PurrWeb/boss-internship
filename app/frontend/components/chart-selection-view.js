import React from "react"

export default class ChartSelectionView extends React.Component {
    static propTypes = {
        previewComponent: React.PropTypes.object,
        selectionComponent: React.PropTypes.object
    }
    render(){
        return <div>
            <div
                className="chart-selection-view__selected-shift-editor"
                style={{opacity: this.props.previewComponent !== undefined ? "0": "1"}}>
                {this.props.selectionComponent}
            </div>
            <div className="chart-selection-view__preview-shift-editor">
                {this.props.previewComponent}
            </div>
        </div>
    }
}