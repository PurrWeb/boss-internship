import React from "react"
import StaffImageInput from "~components/staff-image-input"
import convertImageToDataUrl from "~lib/convert-image-to-data-url"
import $ from "jquery"

const NOT_YET_DETECTED = "NOT_YET_DETECTED";

export default class StaffMemberFormAvatarImage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            existingImage: NOT_YET_DETECTED
        }
    }
    componentDidMount(){
        var avatarPreview = $(".avatar_preview");
        var hasExistingAvatar = avatarPreview.length > 0;
        if (hasExistingAvatar){
            avatarPreview.hide();
            convertImageToDataUrl(
                avatarPreview.prop("src"),
                (dataUrl) => this.setState({existingImage: dataUrl}),
                "image/jpeg",
            );
        } else {
            this.setState({"existingImage": null});
        }
    }
    render(){
        if (this.state.existingImage === NOT_YET_DETECTED) {
            return false;
        }
        return <StaffImageInput existingImage={this.state.existingImage} />
    }
}