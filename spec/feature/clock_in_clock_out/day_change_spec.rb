require 'feature/feature_spec_helper'

RSpec.describe 'Clock in clock out', :type => :feature, js: true do
  let(:clock_in_clock_out_index_page) { PageObject::ClockInClockOutIndexPage.new }
  let(:api_key) { FactoryGirl.create(:api_key) }

  before do
    api_key
  end

  specify do
    clock_in_clock_out_index_page.surf_to
    clock_in_clock_out_index_page.input_api_key(api_key)
  end
end
