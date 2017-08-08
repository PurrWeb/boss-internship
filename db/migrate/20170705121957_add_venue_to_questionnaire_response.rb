class AddVenueToQuestionnaireResponse < ActiveRecord::Migration
  def change
    change_table :questionnaire_responses do |t|
      t.integer :venue_id, null: false
      t.index :venue_id
    end
  end
end
