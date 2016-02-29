json.array! (week.start_date..week.end_date) do |date|
  json.partial!(
    'api/v1/shared/security_rota_overview.json',
    locals: { date: date, rotas: Rota.where(date: date) }
  )
end
