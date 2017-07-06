class RemoveNameFromQuestionnaire < ActiveRecord::Migration
  def change
    change_table :questionnaires do |t|
      t.remove :name
    end
  end
end
