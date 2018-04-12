class SecurityRotaWeeklyPageData
  def initialize(date:)
    @date = date
  end

  attr_reader :date, :week, :rota

  def call
    @week = RotaWeek.new(date)
    @rota = Rota.find_or_initialize_by(
      date: date,
    )

    ActiveRecord::Associations::Preloader.new.preload(
      rota, [:enabled_rota_shifts, :venue]
    )

    self
  end
end
