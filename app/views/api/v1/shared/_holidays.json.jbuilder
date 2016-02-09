json.array! holidays do |holiday|
  json.partial! 'api/v1/shared/holiday.json', locals: { holiday: holiday }
end
