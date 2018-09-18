class AddFirstNameSurnameToInvitesTable < ActiveRecord::Migration
  def change
    add_column :invites, :first_name, :string, null: false
    add_column :invites, :surname, :string, null: false
  end
end
