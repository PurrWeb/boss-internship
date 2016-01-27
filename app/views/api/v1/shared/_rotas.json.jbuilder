json.array! rotas do |rota|
  json.partial! 'api/v1/shared/rota.json', locals: { rota: rota }
end
