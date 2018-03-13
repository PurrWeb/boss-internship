class MobileApp < ActiveRecord::Base
  validates :name, presence: true

  def self.with_download_url
    where("(`ios_download_url` IS NOT NULL) OR (`google_play_url` IS NOT NULL)")
  end

  def self.enabled
    where(disabled_at: nil)
  end

  def has_download_url?
    ios_download_url.present? || google_play_url.present?
  end

  def enabled?
    !disabled_at.present?
  end
end
