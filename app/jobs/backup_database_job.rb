class BackupDatabaseJob < ActiveJob::Base
  def perform
    Services::UploadBackup.new.call
  end
end

