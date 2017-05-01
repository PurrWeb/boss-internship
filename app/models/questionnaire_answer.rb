class QuestionnaireAnswer < ActiveRecord::Base
  attr_accessor :image_ids

  # Associations
  belongs_to :question
  belongs_to :questionnaire_response
  has_many :uploads, as: :imageable

  # Callbacks
  before_save :associate_uploads_to_answer

  # Validations
  # Custom Validates value

  private

  def associate_uploads_to_answer
    return if image_ids.blank?

    image_uploads = Upload.where(id: image_ids)

    return if image_uploads.blank?

    uploads << image_uploads
  end
end
