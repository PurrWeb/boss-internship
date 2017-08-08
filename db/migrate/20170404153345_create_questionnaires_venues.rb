class CreateQuestionnairesVenues < ActiveRecord::Migration
  def change
    create_table :questionnaires_venues do |t|
      t.references :questionnaire, null: false
      t.references :venue, null: false
    end
  end
end
