json.array! clock_in_breaks do |clock_in_break|
  json.partial! 'api/v1/shared/clock_in_break.json', locals: { clock_in_break: clock_in_break }
end
