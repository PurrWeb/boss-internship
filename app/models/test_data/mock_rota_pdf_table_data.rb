class MockRotaPdfTableData
  def header_row
    RotaPDFTableData::Row.new(
      'Name',
      '29th February 2016',
      '1st March 2016',
      '2nd March 2016',
      '3rd March 2016',
      '4th March 2016',
      '5th March 2016',
      '6th March 2016'
    )
  end

  def data_rows
    shifts = [
      '18:00 - 20:00, 21:00 - 22:00',
      '',
      '08:00 - 21:00, 21:30 - 22:00',
      '',
      '',
      '',
      '',
      '',
      '10:00 - 10:30, 12:00 - 12:30, 15:00 - 16:00',
      '',
      '12:00 - 13:00',
      '',
      '',
      '',
      '',
      '10:00 - 11:00',
      '',
      '',
      '',
      '21:00 - 23:00'
    ]

    rows = []
    (1..80).each do |n|
      rows << RotaPDFTableData::Row.new(
        "Staff Member #{n}",
        shifts.sample,
        shifts.sample,
        shifts.sample,
        shifts.sample,
        shifts.sample,
        shifts.sample,
        shifts.sample
      )
    end

    rows
  end
end
