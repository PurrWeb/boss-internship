module PageObject
  class AddVenuePage < Page
    include FlashHelpers

    def surf_to
      visit(url_helpers.new_venue_path)
    end

    def navigation
      @navigation ||= NavigationBar.new(self)
    end

    def form
      @form ||= VenueForm.new(self)
    end

    page_action :fill_and_submit_form_for do |venue|
      form.tap do |form|
        form.fill_in_for(venue)
        form.submit
      end
    end

    def assert_on_correct_page
      expect(find('h1').text).to eq('Add Venue')
    end
  end
end
