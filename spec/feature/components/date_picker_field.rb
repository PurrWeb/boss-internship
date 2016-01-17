module PageObject
  class DatePickerField < Component
    def initialize(parent, selector:)
      @selector = selector
      super(parent)
    end

    page_action :fill_in_date do |date|
      year_select_field.select(year_from_date(date))
      month_select_field.select(month_from_date(date))
      day_select_field.select(day_from_date(date))
    end

    page_action :ui_shows_date do |date|
      expect(
        year_select_field.value
      ).to eq(
        year_from_date(date)
      )

      expect(
        month_select_field.value
      ).to eq(
        month_index_from_date(date)
      )

      expect(
        day_select_field.value
      ).to eq(
        day_from_date(date)
      )
    end

    private
    attr_reader :selector

    def scope
      super.find(selector)
    end

    def year_select_field
      scope.find("select.year")
    end

    def month_select_field
      scope.find("select.month")
    end

    def day_select_field
      scope.find("select.day")
    end

    def year_from_date(date)
      date.strftime('%Y')
    end

    def month_from_date(date)
      date.strftime('%B')
    end

    def month_index_from_date(date)
      date.strftime('%-m')
    end

    def day_from_date(date)
      date.strftime('%-d')
    end
  end
end
