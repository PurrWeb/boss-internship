import PropTypes from 'prop-types';
import React from "react"
import DataUrlImagePicker from "./data-url-image-picker"
import ImageCropper from "./image-cropper"
import AvatarPreview from "./avatar-preview"
import resizeImage from "~/lib/images/resize-image"
import limitImageDimensions from "~/lib/images/limit-image-dimensions"

const STAFF_IMAGE_MIN_WIDTH = 250;
const STAFF_IMAGE_MAX_WIDTH = 600;
const MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING = 700;

export default class StaffImageInput extends React.Component {
    static propTypes = {
        // called when user clicks OK button
        onImageConfirmed: PropTypes.func.isRequired,
        // called after user selected a file from the file picker
        onPickedImageChanged: PropTypes.func.isRequired,
        // Checked every time the file input reference is obtained,
        // if the function returns true a click event is simulated
        // on the file input.
        shouldOpenFilePicker: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state = {
            sourceImage: null,
            croppedImage: null,
            imageDimensions: null
        };
    }
    render(){
        return <div className="row" style={{
                width: 600,
                maxWidth: "80vw",
                marginBottom: 10}
            }>
            <div className="small-12 medium-6 column">
                {this.getImagePicker()}
                {this.getImageCropper()}
            </div>
            <div className="small-12 medium-6 column">
                {this.getCroppedImageUi()}
            </div>
        </div>
    }
    getCroppedImageUi(){
        if (!this.state.croppedImage) {
            return null;
        }
        return <div>
            {this.getRotateButton()}
            {this.getAvatarPreview()}
            {this.getImageValidationMessage()}
            <div style={{marginTop: 4}}>
                {this.getResetButtton()}
                &nbsp;
                {this.getOkButton()}
            </div>
        </div>
    }
    getRotateButton(){
        return <a className="boss2-button" onClick={() => this.rotateImage()}>Rotate</a>
    }
    getOkButton(){
        var classes = ["boss2-button"];
        if (!this.imageDimensionsAreValid(this.state.imageDimensions)){
            classes.push("disabled");
        }

        return <a
            className={classes.join(" ")}
            onClick={() => {
                    this.confirmSelectedImage()
                    this.props.onPickedImageChanged(null);
                }
            }>
            OK
        </a>
    }
    confirmSelectedImage(){
        var imageDimensions = this.state.imageDimensions;
        var dataUrl = this.state.croppedImage;

        if (this.imageDimensionsAreValid(imageDimensions)){
            this.reset();
            if (imageDimensions.width > STAFF_IMAGE_MAX_WIDTH) {
                resizeImage(
                    dataUrl,
                    STAFF_IMAGE_MAX_WIDTH,
                    STAFF_IMAGE_MAX_WIDTH,
                    (resizedImageDataUrl) => this.props.onImageConfirmed(resizedImageDataUrl)
                )
                
            } else {
                this.props.onImageConfirmed(dataUrl);        
            }
            
        } else {
            throw new Error("Selected image isn't valid.");
        }
    }
    getImagePicker(){
        if (this.state.sourceImage) {
            return null;
        }
        return <DataUrlImagePicker
            shouldOpenFilePicker={this.props.shouldOpenFilePicker}
            onChange={
                (dataUrl) => {
                    // iOS has a bug where the image gets squashed in the canvas,
                    // if it uses too much memory
                    limitImageDimensions(
                        dataUrl,
                        MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING,
                        MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING,
                        (dataUrl) => {
                            this.onImagePicked(dataUrl);
                        }
                    );
                }
            } />
    }
    onImagePicked(dataUrl){
        this.setState({sourceImage: dataUrl});
        this.props.onPickedImageChanged(dataUrl)
    }
    rotateImage(){
        if (this.state.rotateFunction) {
            this.state.rotateFunction();
        }
    }
    getImageValidationMessage(){
        var validation = this.validateImageDimensions(this.state.imageDimensions);
        if (validation.isValid) {
            return null;
        }
        return <div className="callout alert" style={{marginTop: 10}}s>
            {validation.message}
        </div>
    }
    getImageCropper(){
        if (!this.state.sourceImage) {
            return null;
        }
        return <ImageCropper
                sourceImage={this.state.sourceImage}
                rotateFunctionReceiver={(rotateFunction) => this.setState({rotateFunction})}
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
            message = `The selected avatar (${squareDimensions(imageDimensions.width)}) is too small,
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
        return <button
            className="boss2-button"
            onClick={() => {
                this.reset()
            }}>
            Cancel
        </button>
    }
    reset(){
        this.setCroppedImage(null);
        this.setState({sourceImage: null});
        this.props.onPickedImageChanged(null);
    }
    getAvatarPreview(){
        return <div>
            Selected avatar:<br/>
            <AvatarPreview src={this.state.croppedImage} />
        </div>
    }
}
