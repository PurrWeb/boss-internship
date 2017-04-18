class QuestionnaireAnswer < ActiveRecord::Base
  # Associations
  belongs_to :question
  belongs_to :questionnaire_response

  # Validations
  # Custom Validates value
end
