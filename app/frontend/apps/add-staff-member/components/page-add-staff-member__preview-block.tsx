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

        PREVIEW

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
