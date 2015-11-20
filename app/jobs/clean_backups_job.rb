class CleanBackupsJob < RecurringJob
  def perform
    Services::CleanBackups.new.call
  end
end
