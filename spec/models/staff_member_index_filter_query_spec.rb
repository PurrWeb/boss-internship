require 'rails_helper'

describe StaffMemberIndexFilterQuery do
  let(:relation) { double("relation") }
  let(:relation_filtered_by_staff_type) do
    double("relation filtered by staff type")
  end
  let(:relation_filtered_by_venue) do
    double("relation filtered by venue")
  end
  let(:relation_joined_by_work_venue) do
    double("relation joined by work venues")
  end
  let(:relation_filtered_by_accessible_venues) do
    double("relation filtered by accessible venues")
  end
  let(:relation_filtered_by_enabled) do
    double("relation filtered by enabled")
  end
  let(:venue_id) { double("venue id") }
  let(:venue) { double("venue", id: venue_id) }
  let(:staff_type) { double("staff type") }
  let(:venue_scope) { double("venue scope") }
  let(:accessible_venues) { double("accessible venues") }
  let(:accessible_venue_ids) { double "accessible venue ids" }
  let(:venue_join_relation) { double "venue join relation" }
  let(:filtered_venue_join_relation) { double "filtered venue join relation" }
  let(:result) { double 'result' }
  let(:query) do
    StaffMemberIndexFilterQuery.new(
      status: status,
      email_text: email_text,
      name_text: name_text,
      staff_type: staff_type,
      venue: venue,
      relation: relation,
      accessible_venues: accessible_venues
    )
  end
  let(:status) { nil }
  let(:email_text) { nil }
  let(:name_text) { nil }

  before do
    allow(staff_type).to receive(:present?).and_return(false)
    allow(venue).to receive(:present?).and_return(false)
    allow(relation).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').and_return(venue_join_relation)
    allow(venue_join_relation).to receive(:where).with('(`staff_member_venues`.`staff_member_id` IS NULL) OR (`staff_member_venues`.`venue_id` IN (?))', accessible_venue_ids).and_return(filtered_venue_join_relation)
    allow(accessible_venues).to receive(:pluck).with(:id).and_return(accessible_venue_ids)
    allow(filtered_venue_join_relation).to receive(:uniq).and_return(result)
  end

  specify do
    expect(query.all).to eq(result)
  end

  context 'filtering by status enabled' do
    let(:status) { 'enabled' }
    let(:relation_filtered_by_enabled) { double 'relation filtered by enabled' }

    before do
      allow(relation).to receive(:enabled).and_return(
        relation_filtered_by_enabled
      )
    allow(relation_filtered_by_enabled).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').and_return(venue_join_relation)
    end

    specify do
      expect(query.all).to eq(result)
    end
  end

  context 'filtering by status disabled' do
    let(:status) { 'disabled' }
    let(:relation_filtered_by_disabled) { double 'relation filtered by enabled' }

    before do
      allow(relation).to receive(:disabled).and_return(
        relation_filtered_by_disabled
      )
    allow(relation_filtered_by_disabled).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').and_return(venue_join_relation)
    end

    specify do
      expect(query.all).to eq(result)
    end
  end

  context 'filtering by staff type' do
    let(:relation_filtered_by_staff_type) { double 'relation filtered by staff type' }

    before do
      allow(staff_type).to receive(:present?).and_return(true)
      allow(relation).to receive(:where).
        with(staff_type: staff_type).
        and_return(relation_filtered_by_staff_type)
      allow(relation_filtered_by_staff_type).to(
        receive(:joins).
          with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').
          and_return(venue_join_relation)
      )
    end

    specify do
      expect(query.all).to eq(result)
    end
  end

  context 'filtering by venue' do
    let(:relation_joined_by_venue) { double 'relation joined by venue' }
    let(:venue_relation) { double 'venue relation' }

    before do
      allow(venue).to receive(:present?).and_return(true)
      allow(relation).to(
        receive(:for_venue).
          with(venue).
          and_return(venue_join_relation)
      )
      allow(venue_join_relation).to(
        receive(:uniq).
          and_return(result)
      )
    end

    specify 'should filter by venue' do
      expect(relation).to(
        receive(:for_venue).
          with(venue).
          and_return(venue_join_relation)
      )
      expect(venue_join_relation).to(
        receive(:uniq).
          and_return(result)
      )
      query.all
    end

    specify do
      expect(query.all).to eq(result)
    end
  end

  context 'filtering by name' do
    let(:name_text) { 'example name' }
    let(:relation_joined_by_name) { double 'relation joined by name' }
    let(:relation_filtered_by_name) { double 'relation filtered by name' }

    before do
      allow(relation).to(
        receive(:joins).
          with(:name).
          and_return(relation_joined_by_name)
      )
      allow(relation_joined_by_name).to(
        receive(:where).
          with(
            "(`names`.first_name LIKE ?) OR (`names`.surname LIKE ?)",
            "%#{name_text}%",
            "%#{name_text}%"
          ).
          and_return(relation_filtered_by_name)
      )
      allow(relation_filtered_by_name).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').and_return(venue_join_relation)
    end

    specify do
      expect(query.all).to eq(result)
    end
  end

  context 'filtering by email' do
    let(:email_text) { 'example email' }
    let(:relation_joined_by_email) { double 'relation joined by email' }
    let(:relation_filtered_by_email) { double 'relation filtered by email' }

    before do
      allow(relation).to(
        receive(:joins).
          with(:email_address).
          and_return(relation_joined_by_email)
      )
      allow(relation_joined_by_email).to(
        receive(:where).
          with(
            "LOWER(`email_addresses`.email) = LOWER(?)",
            email_text
          ).
          and_return(relation_filtered_by_email)
      )
      allow(relation_filtered_by_email).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').and_return(venue_join_relation)
    end

    specify do
      expect(query.all).to eq(result)
    end
  end
end
