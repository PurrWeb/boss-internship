class AddTimeStampsToQuestionnaireResponsesTable < ActiveRecord::Migration
  def change
    change_table :questionnaire_responses do |t|
      t.timestamps
    end
  end
end
