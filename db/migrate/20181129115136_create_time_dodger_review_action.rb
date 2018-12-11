class CreateTimeDodgerReviewAction < ActiveRecord::Migration
  def change
    create_table :time_dodger_review_actions do |t|
      t.references :creator_user, references: :users, null: false, index: true
      t.references :time_dodger_offence_level, null: false, index: true
      t.references :disabled_by_user, references: :users, index: true
      t.datetime :disabled_at
      t.integer :review_level, null: false
      t.text :note, null: false

      t.timestamps null: false
    end
  end
end
