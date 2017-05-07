class QuestionnaireCategoriesQuestionnaire < ActiveRecord::Base
  default_scope { order('position ASC') }

  # Associations
  belongs_to :questionnaire_category
  belongs_to :questionnaire

  # Validations
  validates :questionnaire_id, uniqueness: { scope: :questionnaire_category_id,
    message: "questionnaire can have only one of this category" }
end
