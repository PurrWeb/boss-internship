module PageObject
  class PayRateForm < Component
    page_action :fill_in_for do |pay_rate|
      scope.fill_in('Name', with: pay_rate.name)
      scope.select(PayRate.calculation_type_display_name(pay_rate.calculation_type), from: 'Calculation type')
      scope.fill_in('Rate', with: pay_rate.rate_in_pounds)
    end

    page_action :submit do
      click_button 'Create'
    end

    def scope
      page.find('.pay-rate-form')
    end
  end
end
