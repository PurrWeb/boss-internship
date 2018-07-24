class CreateDisciplinaryTable < ActiveRecord::Migration
  def change
    create_table :disciplinaries do |t|
      t.string :title, null: false
      t.integer :level, null: false
      t.references :staff_member, null: false, index: true
      t.references :created_by_user, references: :users, null: false, index: true
      t.text :note, null: false
      t.references :disabled_by_user, references: :users, index: true
      t.datetime :disabled_at

      t.timestamps null: false
    end
  end
end
