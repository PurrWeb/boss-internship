class PopulateHoursAcceptanceReasons < ActiveRecord::Migration
  def change
    def change
      ActiveRecord::Base.transaction do
        reasons.each do |reason_datum|
          HoursAcceptanceReason.create!(
            text: reason_datum.fetch(:text),
            rank: reason_datum.fetch(:rank),
            enabled: true
          )
        end
      end
    end

    def reasons
      [
        {
          rank: 0,
          text: 'None'
        },
        {
          rank: 100,
          text: 'Illness'
        },
        {
          rank: 200,
          text: 'Cover shift'
        },
        {
          rank: 300,
          text: 'Lateness'
        },
        {
          rank: 400,
          text: 'No clock-in'
        },
        {
          rank: 500,
          text: 'No clock-out'
        },
        {
          rank: 600,
          text: 'Unauthorised absence'
        }
      ]
    end
  end
end
