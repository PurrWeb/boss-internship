json.array! clock_in_events do |clock_in_event|
  json.partial! 'api/v1/shared/clock_in_event.json', locals: { clock_in_event: clock_in_event }
end
