class CreateQuestionnairesQuestionnaireCategories < ActiveRecord::Migration
  def change
    create_table :questionnaire_categories_questionnaires do |t|
      t.references :questionnaire, null: false
      t.references :questionnaire_category, null: false
    end
  end
end
