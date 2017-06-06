require 'rails_helper'

describe NameVariationLookup do
  let(:service) { NameVariationLookup.new() }

  let(:name_group_enabled) { true }
  let(:name_group) { FirstNameGroup.create!(enabled: name_group_enabled) }
  let(:test_names) { ['James', 'Jim', 'Jimmy', 'Jimbo', 'Jamie'] }
  let(:name_options) do
    test_names.each do |name|
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

  describe "#options_for" do
    let(:test_name)  { test_names.first }
    specify do
      expect(
        service.call(test_name)
      ).to eq(test_names)
    end
  end
end
