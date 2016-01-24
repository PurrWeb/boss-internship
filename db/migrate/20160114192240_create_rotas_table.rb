class CreateRotasTable < ActiveRecord::Migration
  def change
    create_table :rotas do |t|
      t.date :date
      t.integer :creator_id
      t.index :creator_id
      t.integer :venue_id
      t.index :venue_id
      t.index [:date, :venue_id], unique: true
      t.timestamps null: false
    end

    change_column_null :rotas, :date, false
    change_column_null :rotas, :creator_id, false
    change_column_null :rotas, :venue_id, false
  end
end
