class AddCheckListSubmissionTable < ActiveRecord::Migration
  def change
    create_table :check_list_submissions do |t|
      t.references :user, null: false
      t.references :venue, null: false
      t.string :name, null: false

      t.timestamps
    end

    add_index :check_list_submissions, :user_id
  end
end
