import React from "react"
import Cropper from "cropperjs"

export default class ImageCropper extends React.Component {
    static propTypes = {
        sourceImage: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        return <div style={{width: 250, height: 250}}>
            <img src={this.props.sourceImage} ref={(img) => this.img = img} />
        </div>
    }
    componentDidMount(){
        new Cropper(this.img, {
            aspectRatio: 1,
            zoomable: false,
            viewMode: 1,
            autoCropArea: 1
        });
    }
}