export interface StaffMember {
  readonly id: number;
  readonly first_name: string;
  readonly avatar_url: string;
  readonly master_venue_name: string;
  readonly type: string;
  readonly disabled_by: string;
  readonly disabled_at: string;
  readonly reviewed: boolean;
};
