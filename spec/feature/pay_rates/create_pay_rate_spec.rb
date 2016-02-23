require 'feature/feature_spec_helper'

RSpec.feature 'Creating a pay_rate' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:add_pay_rate_page) { PageObject::AddPayRatePage.new }
  let(:pay_rates_index_page) { PageObject::PayRatesIndexPage.new }
  let(:prospective_pay_rate) { FactoryGirl.build(:pay_rate, name: 'Party Place') }

  before do
    login_as(dev_user)
  end

  scenario 'successfully adding a new pay_rate to the system' do
    add_pay_rate_page.surf_to
    add_pay_rate_page.fill_and_submit_form_for(prospective_pay_rate)

    pay_rates_index_page.ensure_flash_success_message_displayed('Pay Rate added successfully')
    expect(
      PayRate.find_by(name: prospective_pay_rate.name)
    ).to be_present
  end

  context 'Invalid rate is given' do
    let(:prospective_pay_rate) do
      FactoryGirl.build(
        :pay_rate,
        cents_per_hour: -1
      )
    end

    scenario 'Attempt to create pay_rate with same name as existing' do
      add_pay_rate_page.surf_to

      add_pay_rate_page.fill_and_submit_form_for(prospective_pay_rate)
      add_pay_rate_page.ensure_flash_error_message_displayed('There was a problem creating this pay rate')
    end
  end
end
