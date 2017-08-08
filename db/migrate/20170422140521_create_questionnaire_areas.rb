class CreateQuestionnaireAreas < ActiveRecord::Migration
  def change
    create_table :questionnaire_areas do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
