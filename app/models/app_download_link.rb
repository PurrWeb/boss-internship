class AppDownloadLink
  include ActiveModel::Serialization

  def initialize(app_name:, download_url:, last_sent_at:, mobile_app_id:)
    @app_name = app_name
    @download_url = download_url
    @last_sent_at = last_sent_at
    @mobile_app_id = mobile_app_id
  end
  attr_reader :app_name, :download_url, :last_sent_at, :mobile_app_id
end
