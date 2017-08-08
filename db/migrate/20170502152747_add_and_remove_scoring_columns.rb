class AddAndRemoveScoringColumns < ActiveRecord::Migration
  def change
    add_column :questionnaire_categories_questionnaires, :threshold_score, :float
    remove_column :questionnaire_questions, :scale_option_count
  end
end
