class AddNoteFieldsToDisciplinariesTable < ActiveRecord::Migration
  def change
    add_column :disciplinaries, :conduct, :text, null: false
    add_column :disciplinaries, :nature, :text, null: false
    add_column :disciplinaries, :consequence, :text, null: false
  end
end
