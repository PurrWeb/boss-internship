class UserShowPage < PageObject
  def initialize(user)
    @user = user
    super()
  end
  attr_reader :user

  def surf_to
    visit(url_helpers.user_path(user))
  end

  def assert_on_correct_page
    expect(find('main h1').text).to eq(user.full_name)
  end
end
