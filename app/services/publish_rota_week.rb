class PublishRotaWeek
  def initialize(week:, venue:, requester:)
    @week = week
    @venue = venue
    @requester = requester
  end

  def call
    rotas = (week.start_date..week.end_date).map do |rota_date|
      Rota.find_or_initialize_by(
        date: rota_date,
        venue: venue
      ).tap do |rota|
        rota.creator ||= requester
      end
    end

    PublishRotas.new(rotas: rotas).call
  end

  private
  attr_reader :week, :venue, :requester
end
