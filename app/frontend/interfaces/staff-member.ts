export interface StaffMember {
  readonly id: number;
  readonly first_name: string;
  readonly avatar_url: string;
  readonly master_venue_name: string;
  readonly type: string;
  readonly disabled_by: string;
  readonly disabled_at: string;
  readonly reviewed: boolean;
}

export interface FlaggedRequestFields {
  readonly first_name: string | null;
  readonly surname: string | null;
  readonly date_of_birth: string | null;
  readonly email_address: string | null;
  readonly national_insurance_number: string | null;
}
