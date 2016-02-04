import React from "react"
import StaffImageInput from "~components/staff-image-input"
import $ from "jquery"
import AvatarPreview from "~components/avatar-preview"

export default class StaffMemberFormAvatarImage extends React.Component {
    static propTypes = {
        dataUrlInputSelector: React.PropTypes.string.isRequired,
        selectedImageSelector: React.PropTypes.string.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            preselectedImage: null,
            confirmedImage: null,
            pickedImage: null
        }
    }
    componentWillMount(){
        var avatarPreview = $(this.props.selectedImageSelector);
        if (avatarPreview.length > 0){
            this.setState({preselectedImage: avatarPreview.prop("src")});
            avatarPreview.hide();
        }
    }
    render(){
        var existingImage = this.getExistingImage();

        var staffImageInput = this.getStaffImageInput();

        var hasExistingImageButNotPickedReplacement = existingImage !== null && this.state.pickedImage === null;
        var avatarPreview = null;
        if (hasExistingImageButNotPickedReplacement) {
            avatarPreview = <AvatarPreview src={existingImage} />
        }

        return <div>
            {avatarPreview}
            {staffImageInput}
        </div>
    }
    getStaffImageInput(){
        return <StaffImageInput
                onImageConfirmed={
                    (dataUrl) => {
                        this.getDataUrlInput().val(dataUrl);
                        this.setState({confirmedImage: dataUrl})
                    }
                }
                onPickedImageChanged={
                    (dataUrl) => this.setState({
                        pickedImage: dataUrl
                    })
                }/>
    }
    getExistingImage(){
        if (this.state.confirmedImage){
            return this.state.confirmedImage;
        }
        else if (this.state.preselectedImage) {
            return this.state.preselectedImage;
        }
        return null;
    }
    getDataUrlInput(){
        return $(this.props.dataUrlInputSelector);
    }
}