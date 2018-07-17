class MobileApp < ActiveRecord::Base
  SECURITY_APP_NAME = 'NSecurity'
  CLOCKING_APP_NAME = 'Clocking'

  validates :name, presence: true

  def self.with_download_url
    where("(`ios_download_url` IS NOT NULL) OR (`google_play_url` IS NOT NULL)")
  end

  def security_app?
    name == SECURITY_APP_NAME
  end

  def clocking_app?
    name == CLOCKING_APP_NAME
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

  def self.security_app
    find_by(name: SECURITY_APP_NAME)
  end

  def self.clocking_app
    find_by(name: CLOCKING_APP_NAME)
  end
end
