class AddQuestionnaireAreaIdToQuestionnaireQuestions < ActiveRecord::Migration
  def change
    add_column :questionnaire_questions, :questionnaire_area_id, :integer
  end
end
