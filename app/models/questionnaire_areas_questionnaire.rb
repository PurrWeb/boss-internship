class QuestionnaireAreasQuestionnaire < ActiveRecord::Base
  default_scope { order('position ASC') }

  belongs_to :questionnaire_area
  belongs_to :questionnaire

  acts_as_list scope: :questionnaire
end
