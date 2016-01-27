json.array! rota_shifts do |rota_shift|
  json.partial! 'api/v1/shared/rota_shift.json', locals: { rota_shift: rota_shift }
end
