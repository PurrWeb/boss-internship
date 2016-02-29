module PageObject
  class PayRateForm < Component
    page_action :fill_in_for do |pay_rate|
      fill_in('Name', with: pay_rate.name)
      fill_in('Description', with: pay_rate.description)
      fill_in('Hourly rate', with: pay_rate.pounds_per_hour)
    end

    page_action :submit do
      click_button 'Create'
    end

    def scope
      page.find('.pay_rate-form')
    end
  end
end
