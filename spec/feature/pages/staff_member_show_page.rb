class StaffMemberShowPage < PageObject::Page
  def initialize(staff_member)
    @staff_member = staff_member
    super()
  end
  attr_reader :staff_member

  def surf_to
    visit(url_helpers.staff_member_path(staff_member))
  end

  page_action :ensure_details_displayed_for do |staff_member|
    expect(find(detail_section_selector_for(:venue)).text).to eq(staff_member.venue.name)
    expect(find(detail_section_selector_for(:name)).text).to eq(staff_member.full_name)
    expect(find(detail_section_selector_for(:status)).text).to eq(staff_member_status_message(staff_member))
    expect(find(detail_section_selector_for(:gender)).text).to eq(staff_member.gender.titlecase)
    expect(find(detail_section_selector_for(:email)).text).to eq(staff_member.email)
    expect(find(detail_section_selector_for(:phone_number)).text).to eq(staff_member.phone_number)
    expect(find(detail_section_selector_for(:date_of_birth)).text).to eq(staff_member.date_of_birth.to_date.to_s.strip)
    expect(find(detail_section_selector_for(:national_insurance_number)).text).to eq(staff_member.national_insurance_number)
    expect(find(detail_section_selector_for(:address_1)).text).to eq(staff_member.address.address_1)
    expect(find(detail_section_selector_for(:address_2)).text).to eq(staff_member.address.address_2)
    expect(find(detail_section_selector_for(:address_3)).text).to eq(staff_member.address.address_3)
    expect(find(detail_section_selector_for(:address_4)).text).to eq(staff_member.address.address_4)
    expect(find(detail_section_selector_for(:region)).text).to eq(staff_member.address.region)
    expect(find(detail_section_selector_for(:postcode)).text).to eq(staff_member.address.postcode)
  end

  def assert_on_correct_page
    expect(find('main h1').text).to eq(staff_member.full_name)
  end

  private
  def ensure_name_displayed_for(staff_member)
    expect(find(detail_section_selector_for(:name)).text).to eq(staff_member.full_name)
  end

  def detail_section_selector_for(detail)
    ".show-page-detail[data-detail=\"#{detail.to_s.gsub('_', '-')}\"]"
  end

  def staff_member_status_message(staff_member)
    staff_member.enabled? ? 'Active' : 'Disabled'
  end
end
