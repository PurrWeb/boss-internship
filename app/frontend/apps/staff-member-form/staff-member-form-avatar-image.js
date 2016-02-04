import React from "react"
import StaffImageInput from "~components/staff-image-input"
import $ from "jquery"
import AvatarPreview from "~components/avatar-preview"

export default class StaffMemberFormAvatarImage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            preselectedImage: null,
            croppedImage: null
        }
    }
    componentDidMount(){
        var avatarPreview = $(this.props.selectedImageSelector);
        if (avatarPreview.length > 0){
            this.setState({preselectedImage: avatarPreview.prop("src")});
            avatarPreview.hide();
        }
    }
    render(){
        var existingImage = this.getExistingImage();
        if (existingImage) {
            return <div>
                <AvatarPreview src={existingImage} />
            </div>
        } else {
            return <StaffImageInput
                existingImage={this.state.existingImage}
                onImageCropped={
                    (dataUrl) => {
                        this.getDataUrlInput().val(dataUrl);
                        this.setState({croppedImage: dataUrl})
                    }
                } />
        }
    }
    getExistingImage(){
        if (this.state.preselectedImage) {
            return this.state.preselectedImage;
        }
        else if (this.state.croppedImage){
            return this.state.croppedImage;
        }
    }
    getDataUrlInput(){
        return $(this.props.dataUrlInputSelector);
    }
}