class NavigationBar < PageComponent
  page_action :ensure_sections_appear do |*sections|
    sections.each do |section|
      expect(scope).to have_selector(section_selector(section))
    end
  end

  page_action :ensure_sections_only_appear do |*sections|
    sections.each do |section|
      expect(scope).to have_selector(section_selector(section))
    end

    ensure_sections_dont_appear(*(possible_sections - sections))
  end

  page_action :ensure_sections_dont_appear do |*sections|
    sections.each do |section|
      expect(scope).to_not have_selector(section_selector(section))
    end
  end

  def possible_sections
    section_data.keys
  end

  def scope
    find('header div.navbar')
  end

  private
  def section_data
    {
      brand: {
        selector: '.nav-brand-section'
      }
    }
  end

  def section_selector(section)
    section_data.fetch(section, "'#{section}' section unsupported").fetch(:selector)
  end
end
