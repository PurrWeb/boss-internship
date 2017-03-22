import {pipe, omit, values, find} from 'ramda';
import {FieldState, ErrorsObject} from 'react-redux-form';

import {FormStructure} from '../reducers/forms';
import {AnyDict, Dict} from '../interfaces/index';

export const hasFormValidationErrors = <StructureOfForm extends FormStructure<AnyDict> >(formModelData: StructureOfForm) => {
  return pipe<StructureOfForm, Dict<FieldState>, FieldState[], FieldState | undefined, boolean>(
    omit(['$form']),
    values,
    find((fieldData: FieldState) => !!fieldData.errors ?
      pipe<ErrorsObject, ErrorsObject, (boolean | string)[], boolean | string, boolean>(
        omit(['isFilled']),
        values,
        find((error: boolean | string) => error === true),
        Boolean
      )(fieldData.errors as ErrorsObject) :
      false
    ),
    Boolean
  )(formModelData);
};

export const hasFormUnfilledRequiredFields = <StructureOfForm extends FormStructure<AnyDict> >(formModelData: StructureOfForm) => {
  return pipe<StructureOfForm, Dict<FieldState>, FieldState[], FieldState | undefined, boolean>(
    omit(['$form']),
    values,
    find((fieldData: FieldState) => fieldData.errors && fieldData.errors.isFilled === true),
    Boolean
  )(formModelData);
};
