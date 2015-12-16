class HomePage < PageObject
  def surf_to
    visit('/')
  end

  page_action :ensure_welcome_text_displayed_for do |user|
    expect(page_heading.text).to include("Welcome #{user.name.first_name}")
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
    'Welcome'
  end
end
