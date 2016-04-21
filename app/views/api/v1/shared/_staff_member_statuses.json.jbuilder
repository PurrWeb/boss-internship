json.array! clock_in_statuses do |clock_in_status|
  json.partial! 'api/v1/shared/clock_in_status.json', locals: { clock_in_status: clock_in_status }
end
