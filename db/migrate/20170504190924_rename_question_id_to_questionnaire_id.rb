class RenameQuestionIdToQuestionnaireId < ActiveRecord::Migration
  def change
    rename_column :questionnaire_answers, :question_id, :questionnaire_question_id
  end
end
