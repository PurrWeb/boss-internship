json.clock_in_day do
  json.partial! 'api/v1/shared/clock_in_day.json', locals: { clock_in_day: clock_in_day }
end
