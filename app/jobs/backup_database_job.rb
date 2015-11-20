class BackupDatabaseJob < RecurringJob
  def perform
    Services::UploadBackup.new.call
  end
end

