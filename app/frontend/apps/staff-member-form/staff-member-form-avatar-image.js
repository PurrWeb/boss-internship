import React from "react"
import StaffImageInput from "~components/staff-image-input"
import $ from "jquery"
import AvatarPreview from "~components/avatar-preview"
import { ModalContainer, ModalDialog} from "react-modal-dialog"

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
            pickedImage: null,
            showModal: false,
            previousShowModalValue: false
        }
    }
    componentDidUpdate(){
        if (this.showModalChanged()) {
            this.setState({previousShowModalValue: this.state.showModal})
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

        var hasExistingImage = existingImage !== null;
        var avatarPreview = null;
        if (hasExistingImage) {
            avatarPreview = <AvatarPreview src={existingImage} />
        }

        var selectImageButton = null;
        if (!this.state.showModal) {
            var selectImageButtonText = hasExistingImage ? "Use a different image" : "Select image";
            selectImageButton = <a
                className="boss2-button boss2-button_role_edit"
                style={{marginTop: hasExistingImage ? 4 : 0}}
                onClick={() => this.setState({showModal: true})}>
                {selectImageButtonText}
            </a>
        }

        return <div>
            {avatarPreview}
            {hasExistingImage ? <br/> : null}
            {selectImageButton}
            {this.getModal()}
        </div>
    }
    getModal(){
        if (!this.state.showModal){
            return null;
        }

        var closeModal = () => {
            this.setState({
                showModal: false,
                pickedImage: null
            })
        };
        var staffImageInput = this.getStaffImageInput();
        return <ModalContainer onClick={closeModal}>
            <ModalDialog onClose={closeModal}>
                {staffImageInput}
            </ModalDialog>
        </ModalContainer>
    }
    getStaffImageInput(){
        return <StaffImageInput
                shouldOpenFilePicker={() => this.shouldOpenFilePicker()}
                onImageConfirmed={
                    (dataUrl) => {
                        this.getDataUrlInput().val(dataUrl);
                        this.setState({
                            confirmedImage: dataUrl,
                            showModal: false
                        })
                    }
                }
                onPickedImageChanged={
                    (dataUrl) => {
                        this.setState({
                            pickedImage: dataUrl
                        })
                    }
                }/>
    }
    showModalChanged(){
        return this.state.previousShowModalValue !== this.state.showModal;
    }
    shouldOpenFilePicker(){
        var showModalChanged = this.showModalChanged();
        return showModalChanged && this.state.showModal;
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