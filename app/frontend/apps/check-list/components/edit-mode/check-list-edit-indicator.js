import React from 'react';
import ReactDOM from 'react-dom';

class EditIndicator extends React.PureComponent {
  componentDidMount() {
    this.editIndicator = document.createElement('div');
    document.body.insertBefore(this.editIndicator, document.body.firstChild);
    this.renderEditMode(this.props);
  }
  
  componentWillUnmount(){
    ReactDOM.unmountComponentAtNode(this.editIndicator);
    document.body.removeChild(this.editIndicator);
  }

  renderEditMode(props) {
    let cont;
    ReactDOM.render(
      <div className="boss-alert boss-alert_role_page-note boss-alert_status_warning">
        <p className="boss-alert__text">Edit mode</p>
      </div>,
      this.editIndicator
    );
  }

  render() {
    return null;
  }
}

export default EditIndicator;
