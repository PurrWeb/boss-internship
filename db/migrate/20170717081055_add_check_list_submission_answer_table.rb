class AddCheckListSubmissionAnswerTable < ActiveRecord::Migration
  def change
    create_table :check_list_submission_answers do |t|
      t.references :check_list_submission, null: false
      t.string :description, null: false
      t.string :note
      t.boolean :answer, null: false, default: false
      
      t.timestamps
    end

    add_index :check_list_submission_answers, :check_list_submission_id
  end
end
