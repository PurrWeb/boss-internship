class SendMobileAppDownloadEmail
  Result = Struct.new(:success, :mobile_app_download_link_send) do
    def success?
      success
    end
  end

  def initialize(staff_member:, mobile_app:)
    @staff_member = staff_member
    @mobile_app = mobile_app
  end
  attr_reader :staff_member, :mobile_app

  def call
    MobileAppDownloadLinkMailer.
      download_link_email(
        staff_member_id: staff_member.id,
        mobile_app_id: mobile_app.id
      ).deliver_now

    sent_at = Time.current

    mobile_app_download_link_send = MobileAppDownloadLinkSend.where(staff_member: staff_member, mobile_app: mobile_app).last
    if !mobile_app_download_link_send.present?
      mobile_app_download_link_send = MobileAppDownloadLinkSend.new(staff_member: staff_member, mobile_app: mobile_app)
    end

    mobile_app_download_link_send.update_attributes!(sent_at: sent_at)

    Result.new(true, mobile_app_download_link_send)
  end
end
