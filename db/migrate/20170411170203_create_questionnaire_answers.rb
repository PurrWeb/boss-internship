class CreateQuestionnaireAnswers < ActiveRecord::Migration
  def change
    create_table :questionnaire_answers do |t|
      t.references :question, index: true
      t.references :questionnaire_response, index: true
      t.string  :value, null: false
    end
  end
end
