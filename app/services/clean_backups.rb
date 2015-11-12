module Services
  class CleanBackups
    def call
      backups = Backup.where("created_at < ?", 90.days.ago)
      count   = backups.count

      backups.destroy_all if count > 0

      "Removed #{count} old backups"
    end
  end
end
