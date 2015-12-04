class ChangeUserGenderColumnFormat < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.change :gender, :string
    end
  end
end
