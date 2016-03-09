import React from "react"
import _ from "underscore"

const VALID_IMAGE_FILE_EXTENSIONS = ["jpeg", "jpg", "png"];

function getSupportedFormatsString(formats){
    var lastExtension = _(VALID_IMAGE_FILE_EXTENSIONS).last();
    var extensionsExceptLast = _(VALID_IMAGE_FILE_EXTENSIONS).without(lastExtension);
    return extensionsExceptLast.join(", ") + " or " + lastExtension;
}

export default class DataUrlImagePicker extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            validationMessage: null
        }
    }
    render(){
        return <div>
            <input type="file"
                onChange={() => this.onFileSelected()}
                ref={(ref) => this.fileInput = ref} />
            {this.getValidationMessageElement()}
        </div>
    }
    getValidationMessageElement(){
        var message = this.state.validationMessage;
        if (!message) {
            return null;
        }
        return <div className="alert alert-danger" style={{marginTop: 10}}>
            {message}
        </div>
    }
    onFileSelected(){
        var file = this.fileInput.files[0];
        if (!this.validateFile(file)){
            return;
        }

        var reader = new FileReader();
        reader.addEventListener("load", () => {
            var dataUrl = reader.result;
            this.props.onChange(dataUrl);
        });
        reader.readAsDataURL(file);
    }
    validateFile(file){
        var validationMessage = null;
        var fileExtension = _.last(file.name.split(".")).toLowerCase();

        if (!_(VALID_IMAGE_FILE_EXTENSIONS).contains(fileExtension)) {
            validationMessage = `File extension "${fileExtension}"
                is not supported. Use a ${getSupportedFormatsString()} file.`;
        }

        this.setState({validationMessage: validationMessage});

        return validationMessage === null;
    }
}
