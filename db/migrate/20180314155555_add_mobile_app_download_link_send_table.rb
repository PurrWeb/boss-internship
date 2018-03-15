class AddMobileAppDownloadLinkSendTable < ActiveRecord::Migration
  def change
    create_table :mobile_app_download_link_sends do |t|
      t.datetime :sent_at, null: false
      t.integer :staff_member_id, null: false
      t.integer :mobile_app_id, null: false
      t.timestamps

      t.index [:staff_member_id, :mobile_app_id], unique: true, name: 'no_mobile_dowload_send_dups'
    end
  end
end
