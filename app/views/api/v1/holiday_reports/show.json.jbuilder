json.holidays do
  json.partial!(
    partial: 'api/v1/shared/holidays.json',
    locals: {
      holidays: holidays
    }
  )
end

json.staff_members do
  json.partial!(
    partial: 'api/v1/shared/staff_members.json',
    locals: {
      staff_members: staff_members
    }
  )
end
