class NavigationBar < PageComponent
  page_action :ensure_branding_displayed do
    link = header_section.find('a.navbar-brand')
    expect(link).to have_text('Boss')
    expect(link['href']).to eq('/')
  end

  page_action :ensure_only_sections_displayed do |*sections|
    Array(sections).each do |section|
      expect(scope).to have_selector(section_selector(section))
    end

    (possible_sections - Array(sections)).each do |section|
      expect(scope).not_to have_selector(section_selector(section))
    end
  end

  page_action :ensure_only_sections_highlighted do |*sections|
    Array(sections).each do |section|
      ensure_section_highlighted(section)
    end

    (possible_sections - Array(sections)).each do |section|
      if section_displayed?(section)
        ensure_section_not_highlighted(section)
      end
    end
  end

  page_action :ensure_sections_dont_appear do |*sections|
    sections.each do |section|
      expect(scope).to_not have_selector(section_selector(section))
    end
  end

  page_action :ensure_user_section_not_displayed do
    expect(scope).not_to have_selector(user_section_selector)
  end

  page_action :ensure_user_section_displayed_for do |user|
    ensure_user_section_login_details_displayed_for(user)
    ensure_user_section_logout_link_displayed
  end

  def possible_sections
    section_data.keys
  end

  def scope
    find('header div.navbar')
  end

  private
  def ensure_section_highlighted(section)
    expect(scope.find(section_selector(section)).find('a')['class'].split(' ')).to include('active')
  end

  def ensure_section_not_highlighted(section)
    expect(scope.find(section_selector(section)).find('a')['class'].split(' ')).to_not include('active')
  end

  def section_displayed?(section)
    scope.has_selector?(section_selector(section))
  end

  def ensure_user_section_login_details_displayed_for(user)
    expect(user_section).to have_text("Signed in as #{user.email}")
  end

  def ensure_user_section_logout_link_displayed
    link = user_section.find_link('Sign out')
    expect(link['href']).to eq(url_helpers.destroy_user_session_path)
  end

  def brand_section
    scope.find(header_section)
  end

  def header_section
    scope.find('.navbar-header')
  end

  def user_section
    scope.find(user_section_selector)
  end

  def user_section_selector
    '.nav-user-section'
  end

  def section_data
    {
      users: {
        selector: '.nav-users-section'
      },
      staff_members: {
        selector: '.nav-staff-members-section'
      }
    }
  end

  def section_selector(section)
    section_data.fetch(section) { raise "'#{section}' section unsupported" }.fetch(:selector)
  end
end
