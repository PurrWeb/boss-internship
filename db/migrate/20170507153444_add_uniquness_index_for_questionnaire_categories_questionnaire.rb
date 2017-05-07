class AddUniqunessIndexForQuestionnaireCategoriesQuestionnaire < ActiveRecord::Migration
  def change
    add_index :questionnaire_categories_questionnaires, [:questionnaire_category_id, :questionnaire_id],
      unique: true, name: 'questionnaire_categories_questionnaire_unique_index'
  end
end
