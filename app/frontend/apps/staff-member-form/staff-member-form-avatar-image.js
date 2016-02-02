import React from "react"
import StaffImageInput from "~components/staff-image-input"
import $ from "jquery"
import AvatarPreview from "~components/avatar-preview"

const NOT_YET_DETECTED = "NOT_YET_DETECTED";

export default class StaffMemberFormAvatarImage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedImage: null
        }
    }
    componentDidMount(){
        var avatarPreview = $(this.props.selectedImageSelector);
        if (avatarPreview.length > 0){
            this.setState({selectedImageUrl: avatarPreview.prop("src")});
            avatarPreview.hide();
        }
    }
    render(){
        if (this.state.selectedImageUrl) {
            return <div>
                <AvatarPreview src={this.state.selectedImageUrl} />
            </div>
        } else {
            return <StaffImageInput
                existingImage={this.state.existingImage}
                onImageCropped={(dataUrl) => this.getDataUrlInput().val(dataUrl)} />
        }
    }
    getDataUrlInput(){
        return $(this.props.dataUrlInputSelector);
    }
}