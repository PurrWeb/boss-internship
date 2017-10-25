import PropTypes from 'prop-types';
import React from "react"
import Cropper from "cropperjs"
import _ from "underscore"

export default class ImageCropper extends React.Component {
    static propTypes = {
        sourceImage: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        rotateFunctionReceiver: PropTypes.func.isRequired
    }
    shouldComponentUpdate(nextProps){
        return this.props.sourceImage !== nextProps.sourceImage;
    }
    render(){
        if (!this.props.sourceImage) {
            return null;
        }
        return <div style={{width: 250, height: 250}}>
            <img src={this.props.sourceImage} ref={(img) => this.img = img} />
        </div>
    }
    componentDidMount(){
        this.updateCropper();
    }
    componentDidUpdate(){
        this.updateCropper();
    }
    updateCropper(){
        if (!this.props.sourceImage) {
            if (this.cropper) {
                this.cropper.destroy();
                this.cropper = null;
            }
            return;
        }
        var callOnChange = () => this.callOnChange(this.cropper);
        callOnChange = _.throttle(callOnChange, 500); // prevent calling too often while zooming
        this.cropper = new Cropper(this.img, {
            aspectRatio: 1,
            zoomable: true,
            viewMode: 2,
            autoCropArea: 1,
            minCropBoxWidth: 25,
            minCropBoxHeight: 25,
            toggleDragModeOnDblClick: false,
            cropend: callOnChange,
            built: callOnChange,
            zoom: callOnChange,
            rotate: callOnChange
        });

        // The clean way to do this would be to pass the rotation in as a prop. But
        // right now all the state is inside the cropper tool, not in our React code,
        // so it's difficult to re-render the cropper with the new rotation value.
        this.props.rotateFunctionReceiver(() => {
            this.cropper.rotate(90);
            callOnChange();
        });
    }
    componentWillUnmount() {
        this.cropper.destroy();
    }
    callOnChange(cropper){
        var croppedCanvas = cropper.getCroppedCanvas();
        var dataUrl = croppedCanvas.toDataURL("image/jpeg");
        var imageDimensions = {
            width: croppedCanvas.width,
            height: croppedCanvas.height
        };
        this.props.onChange(dataUrl, imageDimensions);
    }
}