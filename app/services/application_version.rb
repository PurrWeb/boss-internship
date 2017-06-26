class ApplicationVersion

  def self.version
    @version_file = "#{ Rails.root }/.version_number"

    if File.file?(@version_file)
      File.read(@version_file).strip
    else
      raise ".version_number file don't exist, please create it in root folder" 
    end
  end
end
