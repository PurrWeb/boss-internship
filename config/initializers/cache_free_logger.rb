class CacheFreeLogger < ::Logger
  def debug(message, *args, &block)
    super unless message.include?('CACHE')
  end
end

ActiveRecord::Base.logger = ActiveSupport::TaggedLogging.new(
  CacheFreeLogger.new(STDOUT)
) if Rails.env.development?
