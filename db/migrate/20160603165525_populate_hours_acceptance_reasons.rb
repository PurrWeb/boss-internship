class PopulateHoursAcceptanceReasons < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      reasons.each do |reason_datum|
        HoursAcceptanceReason.create!(
          text: reason_datum.fetch(:text),
          rank: reason_datum.fetch(:rank),
          enabled: true,
          note_required: reason_datum.fetch(:note_required)
        )
      end
    end
  end

  def reasons
    [
      {
        rank: 0,
        text: 'None',
        note_required: false
      },
      {
        rank: 100,
        text: 'Illness',
        note_required: false
      },
      {
        rank: 200,
        text: 'Cover shift',
        note_required: false
      },
      {
        rank: 300,
        text: 'Lateness',
        note_required: false
      },
      {
        rank: 400,
        text: 'No clock-in',
        note_required: false
      },
      {
        rank: 500,
        text: 'No clock-out',
        note_required: false
      },
      {
        rank: 600,
        text: 'Unauthorised absence',
        note_required: false
      },
      {
        rank: 1000,
        text: 'Other',
        note_required: true
      }
    ]
  end
end
