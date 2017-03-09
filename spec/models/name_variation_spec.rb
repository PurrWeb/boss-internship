require 'rails_helper'

describe NameVariation do
  describe "#options_for" do
    let(:test_name)  { NameVariation::TEST_EXAMPLE_NAMES.first }
    specify do
      expect(
        NameVariation.variations_for(test_name)
      ).to eq(NameVariation::TEST_EXAMPLE_NAMES - [test_name])
    end
  end
end
