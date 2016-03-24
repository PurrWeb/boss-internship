Date::DATE_FORMATS[:default] = "%e %B %Y"
Time::DATE_FORMATS[:default] = "%d-%m-%Y %H:%M"
Date::DATE_FORMATS[:human_date] = lambda {|date| date.strftime("#{date.day.ordinalize} %B %Y") }
Time::DATE_FORMATS[:human_date] = lambda {|time| time.strftime("#{time.day.ordinalize} %B %Y") }
Time::DATE_FORMATS[:human_time_no_date] = "%H:%M"

Time::DATE_FORMATS[:human] = lambda { |time| time.strftime("%H:%M #{time.day.ordinalize} %B %Y") }
