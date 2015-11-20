class AddBackupsTable < ActiveRecord::Migration
  def change
    create_table :backups do |t|
      t.integer :size, null: false, default: 0
      t.string  :dump

      t.timestamps
    end
  end
end
