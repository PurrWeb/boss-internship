require 'rails_helper'

describe NameVariationLookup do
  let(:service) { NameVariationLookup.new() }

  let(:name_group_enabled) { true }
  let(:name_group) { FirstNameGroup.create!(enabled: name_group_enabled) }
  let(:first_names) { ['James', 'Jim', 'Jimmy', 'Jimbo', 'Jamie'] }
  let(:surnames) { ['McCloud', 'Mc Cloud', "Mc'Cloud"] }
  let(:name_options) do
    first_names.each do |name|
      FirstNameOption.create!(
        first_name_group: name_group,
        name: name
      )
    end
  end

  before do
    name_group
    name_options
  end

  describe "#first name spellings" do
    let(:first_name)  { first_names.sample }
    specify do
      expect(
        service.first_name(first_name)
      ).to eq(first_names)
    end
  end

  describe "#surname spellings" do
    let(:surname)  { surnames.sample }
    specify do
      expect(
        service.surname(surname)
      ).to eq(surnames)
    end
  end
end
