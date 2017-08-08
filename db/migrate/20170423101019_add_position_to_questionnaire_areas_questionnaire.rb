class AddPositionToQuestionnaireAreasQuestionnaire < ActiveRecord::Migration
  def change
    add_column :questionnaire_areas_questionnaires, :position, :integer
    add_column :questionnaire_categories_questionnaires, :position, :integer
  end
end
