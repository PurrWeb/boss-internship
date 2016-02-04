import React from "react"
import DataUrlImagePicker from "./data-url-image-picker"
import ImageCropper from "./image-cropper"
import AvatarPreview from "./avatar-preview"
import resizeImage from "~lib/resize-image"

const STAFF_IMAGE_MIN_WIDTH = 250;
const STAFF_IMAGE_MAX_WIDTH = 600;

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

        return <div className="row" style={{maxWidth: 600, marginBottom: 10}}>
            <div className="col-md-6">
                {this.getImagePicker()}
                {this.getImageCropper()}
            </div>
            <div className="col-md-6">
                {this.getAvatarPreview()}
                {this.getImageValidationMessage()}
                {this.getResetButtton()}
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
    getImageValidationMessage(){
        if (!this.state.imageDimensions || !this.state.croppedImage) {
            return null
        }

        var validation = this.validateImageDimensions(this.state.imageDimensions);
        if (validation.isValid) {
            return null;
        }
        return <div className="alert alert-danger" style={{marginTop: 10}}s>
            {validation.message}
        </div>
    }
    getImageCropper(){
        if (!this.state.sourceImage) {
            return null;
        }
        return <ImageCropper
                sourceImage={this.state.sourceImage}
                onChange={(dataUrl, imageDimensions) => this.setCroppedImage(dataUrl, imageDimensions) } />
    }
    setCroppedImage(dataUrl, imageDimensions){
        if (dataUrl === null){
            imageDimensions = null;
        }

        this.setState({
            croppedImage: dataUrl,
            imageDimensions
        })
        if (this.imageDimensionsAreValid(imageDimensions)){
            if (imageDimensions.width > STAFF_IMAGE_MAX_WIDTH) {
                resizeImage(
                    dataUrl,
                    STAFF_IMAGE_MAX_WIDTH,
                    STAFF_IMAGE_MAX_WIDTH,
                    (resizedImageDataUrl) => this.props.onImageCropped(resizedImageDataUrl)
                )
                
            } else {
                this.props.onImageCropped(dataUrl);        
            }
            
        } else {
            this.props.onImageCropped(null);
        }
    }
    imageDimensionsAreValid(imageDimensions){
        if (imageDimensions === null) {
            return false;
        }
        return this.validateImageDimensions(imageDimensions).isValid;
    }
    validateImageDimensions(imageDimensions){
        function squareDimensions(size){
            return size + "x" + size;
        }

        var message = "";
        if (imageDimensions.width < STAFF_IMAGE_MIN_WIDTH) {
            message = `The image (${squareDimensions(imageDimensions.width)}) is too small,
                it needs to be at least ${squareDimensions(STAFF_IMAGE_MIN_WIDTH)}. Zoom
                out or select a new image.`;
        }
        
        // don't bother validating height, since the image is square anyway
        // also we don't check if the image is too big, if it is we just resize it later

        return {
            isValid: message === "",
            message: message
        }
    }
    getResetButtton(){
        if (!this.state.sourceImage) {
            return null;
        }
        return <button
            className="btn btn-default"
            onClick={() => {
                this.setCroppedImage(null);
                this.setState({sourceImage: null});
            }}>
            Use a different image
        </button>
    }
    getAvatarPreview(){
        if (!this.state.croppedImage) {
            return null;
        }
        return <div>
            Selected avatar:<br/>
            <AvatarPreview src={this.state.croppedImage} />
        </div>
    }
}
