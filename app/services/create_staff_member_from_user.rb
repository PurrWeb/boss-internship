class CreateStaffMemberFromUser
  class Result < Struct.new(:success, :user, :staff_member)
    def success?
      success
    end
  end

  def initialize(user:, params:)
    @user = user
    @params = params
  end

  def call
    result = false
    staff_member = nil

    ActiveRecord::Base.transaction do
      staff_member_result = CreateStaffMember.new(params: params, nested: true).call
      result = staff_member_result.success?
      staff_member = staff_member_result.staff_member

      if result
        user.update_attributes!(staff_member: staff_member)
      end
    end

    Result.new(result, user, staff_member)
  end

  private
  attr_reader :user, :params
end
