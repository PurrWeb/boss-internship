class CreateMarketingTasks < ActiveRecord::Migration
  def change
    create_table :marketing_tasks do |t|
      t.string :title, null: false
      t.string :type, null: false
      t.datetime :due_at, null: false
      t.references :venue, null: false, index: true
      t.references :created_by_user, null: false
      t.references :assigned_to_user, index: true
      t.references :disabled_by_user
      t.datetime :disabled_at
      t.string :description
      t.string :size
      t.float :height_cm
      t.float :width_cm
      t.boolean :facebook_cover_page
      t.boolean :facebook_booster
      t.boolean :print
      t.datetime :start_time
      t.text :days
      t.boolean :facebook_announcement

      t.timestamps null: false
    end
  end
end
