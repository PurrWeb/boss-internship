class CreateTablesForMessageBoard < ActiveRecord::Migration
  def change
    create_table :dashboard_messages do |t|
      t.string :title, null: false
      t.text :message, null: false
      t.boolean :to_all_venues, null: false, default: false
      t.datetime :published_time
      t.references :created_by_user
      t.datetime :disabled_at
      t.references :disabled_by_user

      t.timestamps null: false
    end

    create_table :dashboard_messages_venues do |t|
      t.references :dashboard_message
      t.references :venue

      t.timestamps null: false
    end
  end
end
