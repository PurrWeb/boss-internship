class CleanBackupsJob < ActiveJob::Base
  def perform
    Services::CleanBackups.new.call
  end
end
