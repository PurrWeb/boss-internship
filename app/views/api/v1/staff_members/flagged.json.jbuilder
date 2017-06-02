json.staff_members do
  json.array! staff_members do |staff_member|
    json.partial! 'flagged_staff_member.json', locals: { staff_member: staff_member }
  end
end
