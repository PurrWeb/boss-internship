/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, omit, toPairs, map, addIndex} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import registrationStepBack from '../../../action-creators/registration-step-back';
import requestingStaffMemberSave from '../../../action-creators/requesting-staff-member-save';
import {
  BasicInformationForm, UploadPhotoForm, VenueForm, ContactDetailsForm, WorkForm,
  FormStructure
} from '../../../reducers/forms';
import {StringDict, Dict} from '../../../interfaces/index';
import {FieldState} from 'react-redux-form';
import {validateAllAddStaffMemberStepForms} from '../../../helpers/form-validators';

type FieldDataPair = [string, FieldState];

interface Props {
}

interface MappedProps {
  readonly basicInformationFields: BasicInformationForm;
  readonly uploadPhotoFormFields: UploadPhotoForm;
  readonly venueFormFields: VenueForm;
  readonly contactDetailsFormFields: ContactDetailsForm;
  readonly workFormFields: WorkForm;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  componentDidMount() {
    validateAllAddStaffMemberStepForms();
  }

  onFormComplete = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch(requestingStaffMemberSave);
  };

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.dispatch(registrationStepBack);
  };

  static renderInformationList(blockData: FormStructure<StringDict>, labelsMap: StringDict) {
    return pipe< FormStructure<StringDict>, Dict<FieldState>, FieldDataPair[], JSX.Element[] >(
      omit(['$form']),
      toPairs,
      addIndex(map)((pair: FieldDataPair, idx: number) => {
        const labelVal = labelsMap[pair[0]];

        return (
          <li key={idx} className="boss3-info-fields-block__list-item">
            <span className="boss3-info-fields-block__field-name">{labelVal}</span>
            <span className="boss3-info-fields-block__field-value">{pair[1].value}</span>
          </li>
        );
      })
    )(blockData);
  }

  renderBasicInformationBlock() {
    const labelsMap: StringDict = {
      firstName: 'First Name',
      surname: 'Surname',
      gender: 'Gender',
      dateOfBirth: 'Date of Birth'
    };

    return (
      <div className="boss3-info-block boss3-info-block_type_with-index boss3-forms-block_adjust_info-block">
        <div className="boss3-info-block__index">1</div>
        <h3 className="boss3-info-block__header">Basic Information</h3>

        <ul className="boss3-info-fields-block">
          {Component.renderInformationList(this.props.basicInformationFields, labelsMap)}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="boss3-forms-block">

        {this.renderBasicInformationBlock()}

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
  const {forms} = state.formsData;

  return {
    basicInformationFields: forms.basicInformationForm,
    uploadPhotoFormFields: forms.uploadPhotoForm,
    venueFormFields: forms.venueForm,
    contactDetailsFormFields: forms.contactDetailsForm,
    workFormFields: forms.workForm
  };
};

export default connect(
  mapStateToProps
)(Component);
