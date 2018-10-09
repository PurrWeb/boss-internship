class DisciplinariesFilter
  def initialize(filter_data:)
    @filter_data = filter_data
  end

  attr_reader :filter_data

  def call
    start_date = filter_data.fetch(:start_date)
    end_date = filter_data.fetch(:end_date)

    if start_date.present? && end_date.present?
      filter_data[:start_date] = UIRotaDate.format(start_date)
      filter_data[:end_date] = UIRotaDate.format(end_date)
    end
    filter_data
  end
end
