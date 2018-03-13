class MobileAppDownloadLinkMailer < ApplicationMailer
  def download_link_email(staff_member_id:, mobile_app_id:)
    staff_member = StaffMember.enabled.find(staff_member_id)
    mobile_app = MobileApp.enabled.find(mobile_app_id)

    mail(
      to: staff_member.email,
      subject: "#{mobile_app.name} App Download Instructions"
    ) do |format|
      format.html do
        render locals: {
          app_name: mobile_app.name,
          google_play_url: mobile_app.google_play_url,
          ios_download_url: mobile_app.ios_download_url
        }
      end
    end
  end
end
