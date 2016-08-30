require 'feature/feature_spec_helper'

RSpec.describe 'Clock in clock out', :type => :feature, js: true do
  let(:clock_in_clock_out_page) { PageObject::ClockInClockOutIndexPage.new }

  specify 'the rect app should be rendered' do
    clock_in_clock_out_page.surf_to
    clock_in_clock_out_page.assert_on_correct_page
  end
end
