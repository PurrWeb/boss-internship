import React from "react"
import Cropper from "cropperjs"

export default class ImageCropper extends React.Component {
    static propTypes = {
        sourceImage: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
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
            toggleDragModeOnDblClick: false,
            cropend: callOnChange,
            built: callOnChange,
            zoom: callOnChange
        });
    }
    componentWillUnmount() {
        this.cropper.destroy();
    }
    callOnChange(cropper){
        var dataUrl = cropper.getCroppedCanvas().toDataURL("image/jpeg");
        this.props.onChange(dataUrl);
    }
}