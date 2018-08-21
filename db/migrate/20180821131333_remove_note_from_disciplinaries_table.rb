class RemoveNoteFromDisciplinariesTable < ActiveRecord::Migration
  def change
    remove_column :disciplinaries, :note
  end
end
