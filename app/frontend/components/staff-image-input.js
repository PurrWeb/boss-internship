import React from "react"
import DataUrlImagePicker from "./data-url-image-picker"

export default class StaffImageInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            image: null
        };
    }
    render(){
        var imagePicker = null;
        if (!this.state.image) {
            imagePicker = <DataUrlImagePicker
                onChange={(dataUrl) => this.setState({image: dataUrl})} />
        }
        return <div>
            {imagePicker}
            <img src={this.state.image} />
        </div>
    }
}