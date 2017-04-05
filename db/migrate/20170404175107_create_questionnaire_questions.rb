class CreateQuestionnaireQuestions < ActiveRecord::Migration
  def change
    create_table :questionnaire_questions do |t|
      t.references :questionnaire_category, index: true
      t.references :questionnaire, index: true, null: false
      t.string :type, null: false
      t.string :text, null: false
      t.float :score
      t.float :scale_increment
      t.integer :scale_option_count
      t.string :help_text

      t.timestamps null: false
    end
  end
end
