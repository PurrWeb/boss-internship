class CreateQuestionnairesVenues < ActiveRecord::Migration
  def change
    create_table :questionnaires_venues do |t|
      t.references :questionnaire
      t.references :venue
    end
  end
end
