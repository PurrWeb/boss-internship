require 'rails_helper'

describe GetAppDownloadLinkData do
  let(:staff_member) { FactoryGirl.create(:staff_member, :security, :with_password) }
  let(:mobile_app) { FactoryGirl.create(:mobile_app, :security_app) }
  let(:service) { GetAppDownloadLinkData.new(staff_member: staff_member) }

  before do
    staff_member
    mobile_app
  end

  specify do
    result = service.call
    expect(result.count).to eq(1)

    link = result.first
    expect(link.mobile_app_id).to eq(mobile_app.id)
    expect(link.app_name).to eq(MobileApp::SECURITY_APP_NAME)
    expect(link.download_url).to eq(url_helpers.api_v1_staff_member_send_app_download_email_path(staff_member.id))
    expect(link.last_sent_at).to eq(nil)
  end

  def app
    Rails.application
  end

  def url_helpers
    app.routes.url_helpers
  end
end
