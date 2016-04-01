class AddShiftTypeToRotaShift < ActiveRecord::Migration
  def change
    change_table :rota_shifts do |t|
      t.string :shift_type
    end

    RotaShift.update_all(shift_type: 'normal')
    change_column_null :rota_shifts, :shift_type, false
  end
end
