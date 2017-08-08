class CreateQuestionnaireCategories < ActiveRecord::Migration
  def change
    create_table :questionnaire_categories do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
