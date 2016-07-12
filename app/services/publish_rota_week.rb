class PublishRotaWeek
  def initialize(week:, venue:, requester:)
    @week = week
    @venue = venue
    @requester = requester
  end

  def call
    ActiveRecord::Base.transaction do
      (week.start_date..week.end_date).map do |rota_date|
        Rota.find_or_initialize_by(
          date: rota_date,
          venue: venue
        ).tap do |rota|
          rota.creator ||= requester
          rota.save! if rota.new_record?
        end
      end

      rotas = Rota.
        where(
          venue: venue,
          date: week.start_date..week.end_date
        ).
        includes(:rota_shifts)


      PublishRotas.new(rotas: rotas, nested: true).call
    end
  end

  private
  attr_reader :week, :venue, :requester
end
