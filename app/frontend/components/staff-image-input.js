import React from "react"
import DataUrlImagePicker from "./data-url-image-picker"
import ImageCropper from "./image-cropper"

export default class StaffImageInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sourceImage: null,
            croppedImage: null
        };
    }
    render(){
        return <div>
            {this.getImagePicker()}
            {this.getImageCropper()}
        </div>
    }
    getImagePicker(){
        if (this.state.sourceImage) {
            return null;
        }
        return <DataUrlImagePicker
            onChange={(dataUrl) => this.setState({sourceImage: dataUrl})} />
    }
    getImageCropper(){
        if (!this.state.sourceImage) {
            return null;
        }
        return <ImageCropper
            sourceImage={this.state.sourceImage}
            onChange={(dataUrl) => this.setState({croppedImage: dataUrl})} />
    }
}