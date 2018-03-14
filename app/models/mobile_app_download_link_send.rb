class MobileAppDownloadLinkSend < ActiveRecord::Base
  belongs_to :staff_member
  belongs_to :mobile_app

  validates :staff_member, presence: true
  validates :mobile_app, presence: true
  validates :sent_at, presence: true
end
