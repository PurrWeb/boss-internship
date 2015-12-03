class ShowUserPage < PageObject
  def initialize(user)
    @user = user
    super()
  end
  attr_reader :user

  def surf_to
    visit(url_helpers.user_path)
  end

  def navigation
    @navigation ||= NavigationBar.new(self)
  end

  page_action :ensure_flash_message_displayed do |message|
    raise 'not implimented'
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
    user.full_name
  end
end
