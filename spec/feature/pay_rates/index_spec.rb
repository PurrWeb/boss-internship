require 'feature/feature_spec_helper'

RSpec.feature 'Pay rates index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:pay_rates_index_page) { PageObject::PayRatesIndexPage.new }
  let(:add_pay_rate_page) { PageObject::AddPayRatePage.new }

  before do
    login_as(dev_user)
  end

  scenario 'clicking add pay rate button takes you to the add pay rates page' do
    pay_rates_index_page.surf_to
    pay_rates_index_page.click_add_pay_rate_button
    add_pay_rate_page.assert_on_correct_page
  end
end
