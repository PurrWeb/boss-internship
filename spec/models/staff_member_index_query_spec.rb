require 'rails_helper'

describe StaffMemberIndexQuery do
  let(:relation) { double("relation") }
  let(:relation_filtered_by_staff_type) do
    double("relation filtered by staff type")
  end
  let(:relation_filtered_by_venue) do
    double("relation filtered by venue")
  end
  let(:staff_type) { double("staff type") }
  let(:venue) { double("venue") }
  let(:query) do
    StaffMemberIndexQuery.new(
      staff_type: staff_type,
      venue: venue,
      relation: relation
    )
  end

  before do
    allow(relation).to receive(:where).and_return(relation_filtered_by_staff_type)
    allow(relation_filtered_by_staff_type).to(
      receive(:for_venue).and_return(relation_filtered_by_venue)
    )
  end

  specify do
    expect(relation).to receive(:where).with(staff_type: staff_type)
    query.all
  end

  specify do
    expect(relation_filtered_by_staff_type).to receive(:for_venue).with(venue)
    query.all
  end

  specify do
    expect(query.all).to eq(relation_filtered_by_venue)
  end
end
