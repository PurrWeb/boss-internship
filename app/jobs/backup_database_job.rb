class BackupDatabaseJob < ActiveJob::Base
  def perform
    if BooleanEnvVariable.new("BACKUP_TO_S3").value
      Services::UploadBackup.new.call
    end
  end
end

