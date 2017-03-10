import {Gender} from './store-models';
import {StringDict} from './index';

export interface RequestStaffMemberSavePayload {
  readonly pin_code: string;
  readonly gender: Gender;
  readonly phone_number: string;
  readonly date_of_birth: string;
  readonly starts_at: string;
  readonly national_insurance_number: string;
  readonly hours_preference_note: string;
  readonly day_preference_note: string;
  readonly avatar_base64: string;
  readonly employment_status_a: boolean;
  readonly employment_status_b: boolean;
  readonly employment_status_c: boolean;
  readonly employment_status_d: boolean;
  readonly employment_status_p45_supplied: boolean;
  readonly first_name: string;
  readonly surname: string;
  readonly staff_type_id: number;
  readonly address: string;
  readonly postcode: string;
  readonly county: string;
  readonly pay_rate_id: number;
  readonly master_venue_id: number;
  readonly work_venue_ids: number[];
  readonly email_address: string;
  readonly sia_badge_number: string;
  readonly sia_badge_expiry_date: string;
}

export interface RequestFormValidatePayload extends StringDict {}
