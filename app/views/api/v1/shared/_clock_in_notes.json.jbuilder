json.array! clock_in_notes do |clock_in_note|
  json.partial! 'api/v1/shared/clock_in_note.json', locals: { clock_in_note: clock_in_note }
end
