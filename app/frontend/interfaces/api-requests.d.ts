import {Gender} from './store-models';
import {StringDict} from './index';

export interface RequestStaffMemberSavePayload {
  readonly pin_code: string | null;
  readonly gender: Gender;
  readonly phone_number: string | null;
  readonly date_of_birth: string | null;
  readonly starts_at: string | null;
  readonly national_insurance_number: string | null;
  readonly hours_preference_note: string | null;
  readonly day_preference_note: string | null;
  readonly avatar_base64: string;
  readonly employment_status_a: boolean;
  readonly employment_status_b: boolean;
  readonly employment_status_c: boolean;
  readonly employment_status_d: boolean;
  readonly employment_status_p45_supplied: boolean;
  readonly first_name: string | null;
  readonly surname: string | null;
  readonly staff_type_id: number | null;
  readonly address: string | null;
  readonly postcode: string | null;
  readonly country: string | null;
  readonly pay_rate_id: number;
  readonly master_venue_id: number | null;
  readonly work_venue_ids: number[] | null;
  readonly email_address: string;
  readonly sia_badge_number: string | null;
  readonly sia_badge_expiry_date: string | null;
}

export interface RequestFormValidatePayload extends StringDict {}
