class WebApiAccessToken
  def initialize(token: nil, expires_at: nil, user:)
    if token.present?
      @token = token
    else
      @token = SecureRandom.hex
    end
    @user = user

    if expires_at.present?
      @expires_at = expires_at.utc
    else
      @expires_at = 30.minutes.from_now.utc
    end
  end

  attr_reader :token, :user, :expires_at

  def self.token_key(token)
    "web_api_token:#{token}"
  end

  def token_key(token)
    WebApiAccessToken.token_key(token)
  end

  def self.revoke!(user:)
    tokens = find_by_user(user: user)

    redis.del(user_key_token_list_key(user))
    tokens.each do |token|
      redis.del(token_key(token.token))
    end
  end

  def self.user_key_token_list_key(user)
    "user_key_token_list-user_id:#{user.id}"
  end

  def user_key_token_list_key(user)
    WebApiAccessToken.user_key_token_list_key(user)
  end

  def self.find_by_token(token:)
    token_data_raw = redis.get(token_key(token))
    if token_data_raw.present?
      token_data = JSON.parse(token_data_raw).symbolize_keys;
      user_id = token_data[:user_id]
      token = token_data[:token]
      user = User.find(user_id)

      WebApiAccessToken.new(token: token, user: user)
    end
  end

  def self.find_by_user(user:)
    token_data_raw = redis.get(user_key_token_list_key(user))
    token_data = JSON.parse(token_data_raw)
    return [] unless token_data.present?
    token_data.map do |token|
      WebApiAccessToken.find_by_token(token: token)
    end
  end

  def json
    {
      token: token,
      user_id: user.id
    }.to_json
  end

  def persist!
    persisted_tokens_keys_raw = redis.get(user_key_token_list_key(user))
    persisted_token_keys = persisted_tokens_keys_raw.present? ? JSON.parse(persisted_tokens_keys_raw) : []

    redis.multi do
      redis.set(
        token_key(token),
        json
      )

      redis.set(
        user_key_token_list_key(user),
        (persisted_token_keys + [token]).to_json
      )
    end
    self
  end

  def self.redis
    Redis.current
  end

  def redis
    Redis.current
  end
end
