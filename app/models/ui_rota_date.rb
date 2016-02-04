class UIRotaDate
  URL_DATE_FORMAT = '%d-%m-%Y'

  def self.parse(date_param)
    Date.strptime(date_param, URL_DATE_FORMAT)
  end

  def self.format(date)
    date.strftime(URL_DATE_FORMAT)
  end
end
