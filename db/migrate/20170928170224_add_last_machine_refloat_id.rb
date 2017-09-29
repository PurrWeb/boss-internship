class AddLastMachineRefloatId < ActiveRecord::Migration
  def change
    add_column :machines_refloats, :last_machine_refloat_id, :integer
  end
end
