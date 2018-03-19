class PaymentCsvUpload < ActiveRecord::Base
  belongs_to :uploaded_by_user, class_name: "User"

  validates :uploaded_by_user, presence: true
  validates :file, presence: true

  mount_uploader :file, PaymentCsvUploader
end
