require 'rails_helper'

describe StaffMemberIndexQuery do
  let(:relation) { double("relation") }
  let(:relation_filtered_by_staff_type) do
    double("relation filtered by staff type")
  end
  let(:relation_filtered_by_venue) do
    double("relation filtered by venue")
  end
  let(:relation_joined_by_venue) do
    double("relation joined by venues")
  end
  let(:relation_filtered_by_accessible_venues) do
    double("relation filtered by accessible venues")
  end
  let(:venue_id) { double("venue id") }
  let(:venue) { double("venue", id: venue_id) }
  let(:staff_type) { double("staff type") }
  let(:venue_scope) { double("venue scope") }
  let(:accessible_venues) { double("accessible venues") }
  let(:accessible_venue_ids) { double "accessible venue ids" }
  let(:query) do
    StaffMemberIndexQuery.new(
      staff_type: staff_type,
      venue: venue,
      relation: relation,
      accessible_venues: accessible_venues
    )
  end

  context 'staff type is present' do
    before do
      allow(Venue).to receive(:where).and_return(venue_scope)
      allow(accessible_venues).to receive(:pluck).and_return(accessible_venue_ids)
      allow(relation).to receive(:where).and_return(relation_filtered_by_staff_type)
      allow(relation_filtered_by_staff_type).to(
        receive(:joins).and_return(relation_joined_by_venue)
      )
      allow(relation_joined_by_venue).to(
        receive(:merge).and_return(relation_filtered_by_venue)
      )
    end

    it 'should filter by staff type' do
      expect(relation).to receive(:where).with(staff_type: staff_type)
      query.all
    end

    it 'should filter by venue' do
      expect(relation_filtered_by_staff_type).to receive(:joins).with(:venue)
      expect(relation_joined_by_venue).to receive(:merge).with(venue_scope)
      query.all
    end

    it 'should return filtered venue' do
      expect(query.all).to eq(relation_filtered_by_venue)
    end

  end

  context 'when no venue is present' do
    before do
      allow(venue).to receive(:present?).and_return(false)
      allow(Venue).to receive(:where).and_return(venue_scope)
      allow(accessible_venues).to receive(:pluck).and_return(accessible_venue_ids)
      allow(relation).to receive(:where).and_return(relation_filtered_by_staff_type)
      allow(relation_filtered_by_staff_type).to(
        receive(:joins).and_return(relation_joined_by_venue)
      )
      allow(relation_joined_by_venue).to(
        receive(:where).and_return(relation_filtered_by_venue)
      )
    end

    it 'should filter by staff type' do
      expect(relation).to receive(:where).with(staff_type: staff_type)
      query.all
    end

    it 'should filter by accessible venues' do
      expect(relation_filtered_by_staff_type).to receive(:joins).with('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`')
      expect(relation_joined_by_venue).to receive(:where).with('(`staff_member_venues`.`staff_member_id` IS NULL) OR (`staff_member_venues`.`venue_id` IN (?))', accessible_venue_ids)
      query.all
    end

    it 'should return filtered venue' do
      expect(query.all).to eq(relation_filtered_by_venue)
    end
  end

  context 'when no staff type is present' do
    before do
      allow(staff_type).to receive(:present?).and_return(false)
      allow(Venue).to receive(:where).and_return(venue_scope)
      allow(accessible_venues).to receive(:pluck).and_return(accessible_venue_ids)
      allow(relation).to(
        receive(:joins).and_return(relation_joined_by_venue)
      )
      allow(relation_joined_by_venue).to(
        receive(:merge).and_return(relation_filtered_by_venue)
      )
    end

    it 'should filter supplied relation by specified venue' do
      expect(relation).to receive(:joins).with(:venue)
      expect(relation_joined_by_venue).to receive(:merge).with(venue_scope)
      query.all
    end

    it 'should not filter by staff type' do
      expect(relation).to_not receive(:where).with(staff_type: staff_type)
      query.all
    end

    it 'should return filtered venue' do
      expect(query.all).to eq(relation_filtered_by_venue)
    end
  end
end
