import React from "react"
import DataUrlImagePicker from "./data-url-image-picker"
import ImageCropper from "./image-cropper"

export default class StaffImageInput extends React.Component {
    static propTypes = {
        existingImage: React.PropTypes.string
    }
    constructor(props){
        super(props);
        this.state = {
            sourceImage: null,
            croppedImage: null
        };
    }
    componentDidMount(){
        if (this.props.existingImage) {
            this.setState({sourceImage: this.props.existingImage});
        }
    }
    render(){

        return <div className="row" style={{maxWidth: 450, marginBottom: 10}}>
            <div className="col-md-8">
                {this.getImagePicker()}
                {this.getImageCropper()}
            </div>
            <div className="col-md-4">
                {this.getAvatarPreview()}
                <br />
                <input type="text" name="avatar-data-url" value={this.state.croppedImage}/>
            </div>
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
    getAvatarPreview(){
        return <div>
            Selected avatar:
            <img style={{
                width: 150,
                border: "2px solid black"
            }} src={this.state.croppedImage} />
        </div>
    }
}