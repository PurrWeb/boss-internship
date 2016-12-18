import React from "react"
import { GithubPicker } from 'react-color';

export default class ColorPicker extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired
    };

    constructor(props){
        super(props);

        this.state = {
            displayPopup: false,
            color: this.props.color
        };
    }

    // FIXME: pass it as onChange prop
    static setBadgeColor(color, event) {
        const currTrJq = $(event.target).closest('tr');
        const currBadgeJq = currTrJq.find('.staff-badge');

        currBadgeJq.css({
            backgroundColor: color
        });
    }

    handleClick = () => {
        this.setState({ displayPopup: !this.state.displayPopup })
    };

    handleClose = () => {
        this.setState({ displayPopup: false })
    };

    handleChange = (color, event) => {
        this.setState({ color: color.hex });
        ColorPicker.setBadgeColor(color.hex, event);
    };

    render(){
        const popup = this.state.displayPopup ? (
                <div className="boss-color-picker__popup-container">
                    <div
                            className="boss-color-picker__cover"
                            onClick={ this.handleClose }
                    />
                    <GithubPicker onChange={ this.handleChange } />
                </div>
            ) : '';

        return (
            <div
                    className="boss-color-picker"
                    onClick={ this.handleClick }
            >
                <div
                        className="boss-color-picker__color_preview"
                        style={{backgroundColor: this.state.color}}
                />
                <div className="boss-color-picker__dropdown-arrow">▼</div>
                {popup}
            </div>
        );
    }
}