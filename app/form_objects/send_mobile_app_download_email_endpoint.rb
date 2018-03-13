class SendMobileAppDownloadEmailEndpoint
  def initialize(mobile_app:, staff_member:)
    @mobile_app = mobile_app
    @staff_member = staff_member
  end
  attr_reader :mobile_app, :staff_member
end
