class VenuesIndexPage < PageObject::Page
  include PageObject::FlashHelpers

  def surf_to
    visit(url_helpers.venues_path)
  end

  page_action :click_add_venue_button do
    click_link 'Add Venue'
  end

  page_action :add_venue do |venue|
    create_venue_form.fill_in('Name', with: venue.name)
    create_venue_form.click_button('Add')
  end

  page_action :ensure_record_displayed_for do |venue|
    find(:css, ".venues-index-listing[data-venue-id=\"#{venue.id}\"]")
  end

  def navigation
    @navigation ||= NavigationBar.new(self)
  end

  def assert_on_correct_page
    expect(page_heading).to(
      have_text(expected_page_heading_text),
      "expected page heading to have test '#{expected_page_heading_text}' got '#{page_heading.text}'"
    )
  end

  private
  def page_heading
    page.find('main h1')
  end

  def expected_page_heading_text
    'Venues'
  end

  def create_venue_form
    @create_venue_form ||= find('.venue-form')
  end
end
