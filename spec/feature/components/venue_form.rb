module PageObject
  class VenueForm < Component
    page_action :fill_in_for do |venue|
      fill_in('Name', with: venue.name)
    end

    page_action :submit do
      click_button 'Create'
    end

    def scope
      page.find('.venue-form')
    end
  end
end
