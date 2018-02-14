class CreateOpsDiaries < ActiveRecord::Migration
  def change
    create_table :ops_diaries do |t|
      t.string :title, null: false
      t.text :text, null: false
      t.integer :priority, null: false
      t.references :venue, index: true, foreign_key: true
      t.references :created_by_user, references: :users, index: true
      t.datetime :disabled_at

      t.timestamps null: false
    end

    add_foreign_key :ops_diaries, :users, column: :created_by_user_id
  end

end
