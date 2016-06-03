class AddNoteRequiredFieldToReason < ActiveRecord::Migration
  def change
    change_table :hours_acceptance_reasons do |t|
      t.boolean :note_required, null: false, default: false
    end

    HoursAcceptanceReason.create!(
      text: 'Other',
      enabled: true,
      rank: 10000,
      note_required: true
    )
  end
end
