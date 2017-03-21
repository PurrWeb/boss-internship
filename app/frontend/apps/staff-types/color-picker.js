import React from "react"
import { GithubPicker } from 'react-color';

export default class ColorPicker extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired,
        colors: React.PropTypes.arrayOf(React.PropTypes.string)
    };

    constructor(props){
        super(props);

        this.state = {
            displayPopup: false,
            color: this.props.color
        };
    }

    // FIXME: pass it as onChange prop
    static changeNeighboringElements(color, event) {
        const currTrJq = $(event.target).closest('tr');
        const badgeJq = currTrJq.find('.boss-badge');
        const textInp = currTrJq.find('[data-selector=staff_type]');

        badgeJq.css({
            backgroundColor: color
        });

        textInp.val(color);
    }

    handleClick = () => {
        this.setState({ displayPopup: !this.state.displayPopup })
    };

    handleClose = () => {
        this.setState({ displayPopup: false })
    };

    handleChange = (color, event) => {
        this.setState({ color: color.hex });
        ColorPicker.changeNeighboringElements(color.hex, event);
    };

    render(){
        const popup = this.state.displayPopup ? (
                <div className="boss-color-picker__popup-container">
                    <div
                            className="boss-color-picker__cover"
                            onClick={ this.handleClose }
                    />
                    <GithubPicker
                        colors={this.props.colors}
                        onChange={ this.handleChange }
                    />
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
