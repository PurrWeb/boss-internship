class CreateFileUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.string :file
      t.references :imageable, polymorphic: true

      t.timestamps null: false
    end
  end
end
