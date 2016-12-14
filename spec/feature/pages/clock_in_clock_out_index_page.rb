module PageObject
  class ClockInClockOutIndexPage < Page
    def surf_to
      visit(url_helpers.clock_in_clock_out_index_path)
    end

    page_action :input_api_key do |api_key|
      scope.fill_in('key', with: api_key.key)
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
      scope.find("button[data-test-marker-api-key-button]")
    end
  end
end
