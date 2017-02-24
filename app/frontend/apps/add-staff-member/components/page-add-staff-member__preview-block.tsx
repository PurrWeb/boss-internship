import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import registrationStepBack from '../../../action-creators/registration-step-back';
import requestingStaffMemberSave from '../../../action-creators/requesting-staff-member-save';

interface Props {
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  onFormComplete = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch(requestingStaffMemberSave);
  };

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.dispatch(registrationStepBack);
  };

  render() {
    return (
      <div className="boss3-forms-block">

        <div className="boss3-info-block boss3-info-block_type_with-index boss3-forms-block_adjust_info-block">
          <div className="boss3-info-block__index">1</div>
          <h3 className="boss3-info-block__header">Basic Information</h3>

          <ul className="boss3-info-fields-block">
            <li className="boss3-info-fields-block__list-item">
              <span className="boss3-info-fields-block__field-name">name</span>
              <span className="boss3-info-fields-block__field-value">Michael</span>
            </li>
            <li className="boss3-info-fields-block__list-item">
              <span className="boss3-info-fields-block__field-name">name</span>
              <span className="boss3-info-fields-block__field-value">Michael</span>
              <ul className="boss3-info-fields-block__field-errors">
                <li className="boss3-info-fields-block__field-error">Some Error</li>
              </ul>
            </li>
            <li className="boss3-info-fields-block__list-item">
              <span className="boss3-info-fields-block__field-name">name</span>
              <span className="boss3-info-fields-block__field-value">Michael</span>
            </li>
          </ul>
        </div>

        <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
          <a href=""
             className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
             onClick={this.onBackClick}
          >
            Back
          </a>
          <a href=""
             onClick={this.onFormComplete}
             className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button"
          >
            Continue
          </a>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {};
};

export default connect(
  mapStateToProps
)(Component);
