class AddMobileApp < ActiveRecord::Migration
  def change
    create_table :mobile_apps do |t|
      t.string :name, null: false
      t.string :ios_download_url
      t.string :google_play_url
      t.datetime :disabled_at
      t.timestamps
    end
  end
end
