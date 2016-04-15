module Services
  class UploadBackup
    include ActionView::Helpers::NumberHelper

    def call
      uri  = URI.parse(ENV["DATABASE_URL"])
      name = uri.path.sub(%r{^/}, '')

      Dir.mktmpdir do |dir|
        cmd = []
        cmd << "mysqldump"
        cmd << "-u #{uri.user}"
        cmd << "-p#{uri.password}" if uri.password
        cmd << name
        cmd << "|"
        cmd << "gzip -9"

        path = "#{dir}/#{name}-#{Time.zone.now.strftime("%Y.%m.%d-%H.%M.%S")}.sql.gz"

        out = `#{cmd.join(" ")} 2>&1 >#{path}`
        unless $?.success?
          raise "mysqldump failed: #{out}"
        end

        backup = Backup.create! dump: File.open(path), size: File.size(path)

        "Created DB dump of #{name} (#{number_to_human_size backup.size})"
      end
    end
  end
end
