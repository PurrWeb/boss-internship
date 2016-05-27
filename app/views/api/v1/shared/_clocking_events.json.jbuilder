json.array! clocking_events do |clocking_event|
  json.partial! 'api/v1/shared/clocking_event.json', locals: { clocking_event: clocking_event }
end
