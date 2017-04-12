class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers do |t|
      t.references :question, index: true
      t.references :questionnaire_response, index: true
      t.string  :selected_value
    end
  end
end
