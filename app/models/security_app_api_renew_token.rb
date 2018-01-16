class SecurityAppApiRenewToken
  def initialize(token: nil, staff_member:)
    unless staff_member.verified?
      raise "Staff member with id: #{staff_member.id} not verified yet"
    end

    if token.present?
      @token = token
    else
      @token = SecureRandom.hex
    end
    @expires_at = 1.day.from_now.utc
    @staff_member = staff_member
  end

  attr_reader :token, :staff_member, :expires_at

  def self.token_lookup_key(token)
    "security_app_api_renew_token-token_lookup:#{token}"
  end

  def token_lookup_key(token)
    SecurityAppApiRenewToken.token_lookup_key(token)
  end

  def self.revoke!(staff_member:)
    token = find_by_staff_member(staff_member: staff_member)

    redis.del(staff_member_lookup_key(staff_member))
    redis.del(token_lookup_key(token))
  end

  def self.staff_member_lookup_key(staff_member)
    "security_app_renew_token_by_staff_member_id:#{staff_member.id}"
  end

  def staff_member_lookup_key(staff_member)
    SecurityAppApiRenewToken.staff_member_lookup_key(staff_member)
  end

  def self.find_by_token(token:)
    token_data_raw = redis.get(token_lookup_key(token))
    if token_data_raw.present?
      token_data = JSON.parse(token_data_raw).symbolize_keys;
      staff_member_id = token_data[:staff_member_id]
      token = token_data[:token]
      staff_member = StaffMember.find(staff_member_id)

      SecurityAppApiRenewToken.new(token: token, staff_member: staff_member)
    end
  end

  def self.find_by_staff_member(staff_member:)
    token = redis.get(staff_member_lookup_key(staff_member))
    if token.present?
      SecurityAppApiRenewToken.find_by_token(token: token)
    end
  end

  def json
    {
      token: token,
      staff_member_id: staff_member.id
    }.to_json
  end

  def persist!
    redis.set(
      token_lookup_key(token),
      json,
      ex: expires_at.to_i
    )

    redis.set(
      staff_member_lookup_key(staff_member),
      token
    )
  end

  def self.issue_new_token!(staff_member)
    SecurityAppApiRenewToken.revoke!(staff_member: staff_member)

    new_token = SecurityAppApiRenewToken.new(staff_member: staff_member)
    new_token.persist!
    new_token
  end

  def self.redis
    Redis.current
  end

  def redis
    Redis.current
  end
end
