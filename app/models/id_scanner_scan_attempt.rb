class IdScannerScanAttempt < ActiveRecord::Base
  SUCCESS_STATUS = 'success'
  RESCAN_STATUS = 'failure_rescan'
  ACCESS_DENIED_STATUS = 'failure_access_denied'
  INVALID_KEY_STATUS = 'failure_invalid_key'
  STATUSES = [SUCCESS_STATUS, RESCAN_STATUS, ACCESS_DENIED_STATUS, INVALID_KEY_STATUS]
  belongs_to :api_key, class_name: 'IdScannerAppApiKey', foreign_key: :id_scanner_app_api_key_id
  belongs_to :linked_staff_member, class_name: 'StaffMember', foreign_key: :linked_staff_member_id

  validates :api_key, presence: true
  validates :guid, presence: true
  validates :status, inclusion: { in: STATUSES}
  validate :staff_member_is_linked_when_required
  before_validation :ensure_guid

  # validation
  def staff_member_is_linked_when_required
    if success? && !linked_staff_member.present?
      errors.add(:linked_staff_member, 'is required when scan successful')
    end
  end

  def success?
    status == SUCCESS_STATUS
  end

  def ensure_guid
    if !guid.present?
      self.guid = SecureRandom.uuid
    end
  end
end
