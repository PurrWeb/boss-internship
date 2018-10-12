class StaffVettingController < ApplicationController
  before_action :set_new_layout

  def index
    authorize! :view, :staff_vetting_page

    staff_on_wrong_payrate_count = [
      StaffMemberWronglyOn18To20PayrateQuery,
      StaffMemberWronglyOn21To24PayrateQuery,
      StaffMemberWronglyOn25PlusPayrateQuery
    ].map do |query_class|
      query_class.new.all.count
    end.sum

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    bounced_emails = BouncedEmailAddress.all.map {|be| be['email']}
    staff_members_with_bounced_email = StaffMember.enabled.joins(:email_address).where({email_addresses: {email: bounced_emails}})
    same_sage_id_result = StaffWithSameSageIdQuery.new.all
    render locals: {
      access_token: access_token.token,
      staff_without_email_count: StaffMembersWithoutEmailQuery.new.all.count,
      staff_without_ni_number_count: StaffMembersWithoutNINumberQuery.new.all.count,
      staff_without_address_count: StaffMembersWithoutAddressQuery.new.all.count,
      staff_without_photo_count: StaffMembersWithoutPhotoQuery.new.all.count,
      staff_with_expired_sia_badge_count: StaffMembersWithExpiringSiaBadgeQuery.new.all.count,
      staff_on_wrong_payrate_count: staff_on_wrong_payrate_count,
      staff_with_same_sage_id_count: same_sage_id_result.all_staff_members.count,
      staff_members_with_bounced_email_count: staff_members_with_bounced_email.count,
      venues: Venue.all,
      staff_types: StaffType.all,
    }
  end
end
