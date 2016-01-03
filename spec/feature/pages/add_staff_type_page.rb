class AddStaffTypePage < PageObject::Page
  include PageObject::FlashHelpers

  def surf_to
    visit(url_helpers.new_staff_type_path)
  end

  page_action :fill_and_submit_form do |name:|
    fill_in('Name', with: name)
    _submit_form
  end

  page_action :submit_form do
    _submit_form
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
  def _submit_form
    click_button('Submit')
  end

  def page_heading
    page.find('main h1')
  end

  def expected_page_heading_text
    'Add Staff Type'
  end
end
