module PageObject
  class AddPayRatePage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.new_pay_rate_path)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def form
      @form ||= PayRateForm.new(self)
    end

    page_action :fill_and_submit_form_for do |pay_rate|
      form.tap do |form|
        form.fill_in_for(pay_rate)
        form.submit
      end
    end

    def assert_on_correct_page
      expect(find('h1').text).to eq('Add Pay Rate')
    end
  end
end
