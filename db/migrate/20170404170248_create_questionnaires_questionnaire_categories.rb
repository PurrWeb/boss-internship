class CreateQuestionnairesQuestionnaireCategories < ActiveRecord::Migration
  def change
    create_table :questionnaire_categories_questionnaires do |t|
      t.references :questionnaire
      t.references :questionnaire_category
    end
  end
end
