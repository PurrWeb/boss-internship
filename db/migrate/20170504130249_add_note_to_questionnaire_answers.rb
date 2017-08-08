class AddNoteToQuestionnaireAnswers < ActiveRecord::Migration
  def change
    add_column :questionnaire_answers, :note, :text
  end
end
