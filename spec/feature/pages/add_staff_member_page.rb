class AddStaffMemberPage < PageObject
  def surf_to
    visit(url_helpers.new_staff_member_path)
  end

  def navigation
    @navigation ||= NavigationBar.new(self)
  end

  def form
    @form ||= StaffMemberForm.new(self)
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
    'Add Staff Member'
  end
end