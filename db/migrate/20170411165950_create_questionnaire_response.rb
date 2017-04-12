class CreateQuestionnaireResponse < ActiveRecord::Migration
  def change
    create_table :questionnaire_responses do |t|
      t.references :questionnaire, index: true
      t.references :user, index: true
    end
  end
end
