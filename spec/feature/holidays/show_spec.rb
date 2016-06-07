require 'feature/feature_spec_helper'

RSpec.describe 'Holidays page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:date) { Time.zone.now.to_date }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:show_page) do
    PageObject::HolidaysShowPage.new(
      date: date,
      venue: venue
    )
  end
  let(:csv_show_page) do
    PageObject::HolidaysShowPage.new(
      date: date,
      venue: venue,
      format: :csv
    )
  end
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      master_venue: venue
    )
  end
  let(:holiday) do
    FactoryGirl.create(:holiday,
      start_date: date,
      end_date: date,
      staff_member: staff_member
    )
  end

  before do
    holiday
    login_as dev_user
  end

  describe 'html show page' do
    specify 'page is acccessible' do
      show_page.surf_to
      show_page.assert_on_correct_page
    end
  end

  describe 'csv show page' do
    specify 'should render csv' do
      expect{
        csv_show_page.surf_to
      }.to_not raise_error
    end
  end
end
