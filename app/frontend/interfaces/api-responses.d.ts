import {Dict} from './index';

interface DictOfStringArrays extends Dict<string[]> {}

export interface ResponseStaffMemberCreateSuccessPayload {
  readonly staff_member_id: number;
}

export interface ResponseStaffMemberCreateErrorPayload {}

export interface ResponseFieldsValidationErrorsPayload extends DictOfStringArrays {
  readonly base: string[];
}
