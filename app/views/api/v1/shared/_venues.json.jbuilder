json.array! venues do |venue|
  json.partial! 'api/v1/shared/venue.json', locals: { venue: venue }
end
