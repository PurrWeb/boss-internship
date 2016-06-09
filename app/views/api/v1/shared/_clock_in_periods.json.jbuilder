json.array! clock_in_periods do |clock_in_period|
  json.partial! 'api/v1/shared/clock_in_period.json', locals: { clock_in_period: clock_in_period }
end
