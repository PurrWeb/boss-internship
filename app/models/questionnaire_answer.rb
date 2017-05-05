class QuestionnaireAnswer < ActiveRecord::Base
  attr_accessor :image_ids

  # Associations
  belongs_to :questionnaire_question
  belongs_to :questionnaire_response
  has_many :uploads, as: :imageable

  # Callbacks
  before_save :associate_uploads_to_answer

  # Validations
  # Custom Validates value

  def pass_value?
    return true if questionnaire_question.pass_values.blank?

    pass_values = questionnaire_question.pass_values.split(',').map(&:strip)

    pass_values.include?(value)
  end

  private

  def associate_uploads_to_answer
    return if image_ids.blank?

    image_uploads = Upload.where(id: image_ids)

    return if image_uploads.blank?

    uploads << image_uploads
  end
end
