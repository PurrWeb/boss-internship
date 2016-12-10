module PageObject
  class ClockInClockOutIndexPage < Page
    def surf_to
      visit(url_helpers.clock_in_clock_out_index_path)
    end

    page_action :input_api_key do |api_key|
      scope.fill_in('Enter key', with: api_key.key)
      submit_form
    end

    def assert_on_correct_page
      scope
    end

    private
    def scope
      page.find('div[data-react-class="ClockInOutApp"]')
    end

    def submit_form
      scope.click_button('Load Clock In/Out page')
    end
  end
end
