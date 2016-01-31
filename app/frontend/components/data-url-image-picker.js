import React from "react"

export default class DataUrlImagePicker extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        return <input type="file"
            onChange={() => this.onFileSelected()}
            ref={(ref) => this.fileInput = ref} />
    }
    onFileSelected(){
        var file = this.fileInput.files[0];
        var reader = new FileReader();
        reader.addEventListener("load", () => {
            var dataUrl = reader.result;
            this.props.onChange(dataUrl);
        });
        reader.readAsDataURL(file);
    }
}
