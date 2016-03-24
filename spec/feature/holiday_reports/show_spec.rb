require 'feature/feature_spec_helper'

RSpec.describe 'Holiday Reports page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:date) { Time.now.to_date }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:show_page) do
    PageObject::HolidayReportsShowPage.new(
      date: date,
      venue: venue
    )
  end

  before do
    login_as dev_user
  end

  specify 'page is acccessible' do
    show_page.surf_to
    show_page.assert_on_correct_page
  end
end