class CreateQuestionnaireAreasQuestionnaires < ActiveRecord::Migration
  def change
    create_table :questionnaire_areas_questionnaires do |t|
      t.references :questionnaire, null: false
      t.references :questionnaire_area, null: false
    end
  end
end
