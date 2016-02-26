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
        selectionComponent: React.PropTypes.object,
        selectionIsClearable: React.PropTypes.bool,
        clearSelection: React.PropTypes.func
    }
    render(){
        return <div style={{position: "relative"}}>
            <div
                className="chart-selection-view__selected-shift-editor"
                style={{opacity: this.hasPreviewComponent() ? "0": "1"}}>
                {this.props.selectionComponent}
            </div>
            <div className="chart-selection-view__preview-shift-editor">
                {this.props.previewComponent}
            </div>
            {this.getClearSelectionButton()}
        </div>
    }
    hasPreviewComponent(){
        return this.props.previewComponent !== null && this.props.previewComponent !== undefined;
    }
    hasSelectionComponent(){
        return this.props.selectionComponent !== null && this.props.selectionComponent !== undefined;
    }
    getClearSelectionButton(){
        if (!this.hasSelectionComponent()){
            return null;
        }
        if (!this.props.selectionIsClearable) {
            return null;
        }
        return <div
            onClick={this.props.clearSelection}
            className={"glyphicon glyphicon-remove chart-selection-view__clear-button"} />
    }
}