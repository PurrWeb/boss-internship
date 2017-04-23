class QuestionnaireCategoriesQuestionnaire < ActiveRecord::Base
  default_scope { order('position ASC') }

  belongs_to :questionnaire_category
  belongs_to :questionnaire
end
