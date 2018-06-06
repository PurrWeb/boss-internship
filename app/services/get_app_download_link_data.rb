class GetAppDownloadLinkData
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def call
    MobileApp.enabled.with_download_url.map do |mobile_app|
      if StaffMemberAbility.new(staff_member).can?(:access, mobile_app)
        last_download_sent = MobileAppDownloadLinkSend.find_by(staff_member: staff_member, mobile_app: mobile_app)
        AppDownloadLink.new(
          mobile_app_id: mobile_app.id,
          app_name: mobile_app.name,
          download_url: api_v1_staff_member_send_app_download_email_path(staff_member.id),
          last_sent_at: last_download_sent.andand.sent_at
        )
      else
        nil
      end
    end.compact
  end
end
