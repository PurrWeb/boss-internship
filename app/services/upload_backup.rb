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
        cmd << "--password=#{uri.password}" if uri.password
        cmd << name

        sql_filename = "#{name}-#{Time.zone.now.strftime("%Y.%m.%d-%H.%M.%S")}.sql"
        sql_file_path = "#{dir}/#{sql_filename}"
        sql_command = "#{cmd.join(" ")} 2>&1 > #{sql_file_path}"
        puts "running: #{sql_command}"

        sql_command_out = `#{sql_command}`
        unless $?.success?
          raise "mysqldump failed: #{sql_command_out}"
        end

        zip_file_path = "#{sql_file_path}.gz"
        zip_command = "gzip -c #{sql_file_path} 2>&1 > #{zip_file_path}"

        zip_command_out = `#{zip_command}`
        unless $?.success?
          raise "zipping dump file failed: #{zip_command_out}"
        end

        backup = Backup.create! dump: File.open(zip_file_path), size: File.size(zip_file_path)

        "Created DB dump of #{name} (#{number_to_human_size backup.size})"
      end
    end
  end
end
