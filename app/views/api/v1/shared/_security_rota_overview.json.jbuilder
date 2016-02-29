staff_types = StaffType.where(role: 'security')
staff_members = StaffMember.joins(:staff_type).merge(staff_types)
rota_shifts = RotaShift.enabled.joins(:rota).merge(rotas).joins(:staff_member).merge(staff_members)

json.date date.iso8601

json.rotas do
  json.partial! partial: 'api/v1/shared/rotas.json', locals: { rotas: rotas }
end

json.staff_members do
  json.partial!(
    partial: 'api/v1/shared/staff_members.json',
    locals: { staff_members: staff_members }
  )
end

json.rota_shifts do
  json.partial!(
    partial: 'api/v1/shared/rota_shifts.json',
    locals: { rota_shifts: rota_shifts }
  )
end

json.staff_types do
  json.partial!(
    partial: 'api/v1/shared/staff_types.json',
    locals: { staff_types: staff_types }
  )
end
