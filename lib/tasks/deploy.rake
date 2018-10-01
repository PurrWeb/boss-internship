require 'shell-spinner'
require 'open3'

namespace :deploy do
  @versions_file = "#{ Rails.root }/.version_number"
  @master_branch = "master"
  @origin = "origin"
  @production = "production"

  desc 'Release'
  task :release => :environment do
    ShellSpinner "Get latest version" do
      @latest_version = get_latest_version
    end
    ShellSpinner "Get latest commit" do
      @last_commit = get_last_commit_hash
    end
  end

  namespace :release do
    task :minor => :release do
      @current_version = increment_minor(@latest_version)
      run_deploy
    end

    task :major => :release do
      @current_version = increment_major(@latest_version)
      run_deploy
    end
  end

  def run_deploy
    unless git_modified? || git_cached? || !remotes? # || git_untracked?
      write_latest_version
      git_add
      git_commit
      begin
        trap('SIGINT') { raise; puts "Task was stoped by CTRL+C"; undo_changes; exit }
        git_push_version
        add_version_tag
        deploy_on_production
        success
      rescue => err
        begin
          undo_changes
          puts err.message
          failed
        rescue
          puts err.message
          failed
        end
      end
    end
  end

  def remotes?
    ShellSpinner "Check for production remote repo" do
      unless run("git remote -v | awk '{print $1}'").include?(@production)
        puts "You don't have an production remote repo"
        raise
      end
    end
    true
  end

  def get_latest_version
    ApplicationVersion.version
  end

  def write_latest_version
    ShellSpinner "Write latest version" do
      File.write(@versions_file, @current_version)
    end
  end

  def increment_minor(version)
    major = version.split(".")[0]
    minor = version.split(".")[1]
    minor = minor.to_i + 1
    "#{ major }.#{ minor }"
  end

  def increment_major(version)
    major = version.split(".")[0]
    minor = version.split(".")[1]
    major = major.to_i + 1
    "#{ major }.0"
  end

  def git_modified?
    ShellSpinner "Check for git modified files" do
      output = run("git ls-files --modified")
      if output.present?
        puts "FAILED !!! You have modified files: "
        print_command_output(output)
        raise
      end
    end
    false
  end

  def git_cached?
    ShellSpinner "Check for git cached files" do
      output = run("git diff --cached --name-only")
      if output.present?
        puts "FAILED !!! You have files to be commited: "
        print_command_output(output)
        raise
      end
    end
    false
  end

  def git_untracked?
    ShellSpinner "Check for git untracked files" do
      output = run("git ls-files --others --exclude-standard")
      if output.present?
        puts "FAILED !!! You have untracked files: "
        print_command_output(output)
        raise
      end
    end
    false
  end

  def git_add(file = ".version_number")
    ShellSpinner "Add version file" do
      run("git add #{ file }")
    end
  end

  def git_commit(message = "Published v#{ @current_version } Release")
    ShellSpinner "Create version file commit" do
      run("git commit -m '#{ message }'")
    end
  end

  def git_push_version
    ShellSpinner "Push to version file to #{ @master_branch }" do
      run("git push #{ @origin } #{ @master_branch }")
    end
  end

  def add_version_tag
    ShellSpinner "Add version tag and push to #{ @master_branch }" do
      run("git tag v#{ @current_version }")
      run("git push #{ @origin } v#{ @current_version }")
    end
  end

  def undo_changes
    puts "\n================".red
    puts "= UNDO CHANGES =".red
    puts "================\n".red
    reset_version_commit
    undo_version_tag
  end

  def reset_version_commit
    ShellSpinner "Reset to prevous commit" do
      run("git reset --hard #{@last_commit}")
    end
    git_push_version
  end

  def undo_version_tag
    ShellSpinner "Remove tag on local repo" do
      run("git tag -d v#{ @current_version }")
    end
    ShellSpinner "Remove tag remote repo" do
      run("git push #{ @origin } :refs/tags/v#{ @current_version }")
    end
  end

  def get_last_commit_hash
    run("git rev-parse --verify HEAD")[0].strip
  end

  def deploy_on_production
    puts "Deploy on production... \n"
    STDOUT.sync = true
    Open3.popen3("git push #{ @production } HEAD:master 2>&1") do |stdin, stdout, stderr, wait_thr|
      stdout.sync = true
      while line = stdout.gets
        puts line
      end
      exit_status = wait_thr.value
      unless exit_status.success?
        raise
      end
    end
  end

  def run(command)
    out = []
    Open3.popen3(command) do |stdin, stdout, stderr, wait_thr|
      exit_status = wait_thr.value
      while line = stdout.gets
        out << line.strip
      end
      while line = stderr.gets
        out << line.strip
      end
      unless exit_status.success?
        raise out.join("\n")
      end
    end
    out
  end

  def print_command_output(output)
    if output.present?
      count = 1;
      puts "\n=================================="
      output.each do |line|
        puts "#{ count }: #{ line }"
        count = count + 1
      end
      puts "==================================\n"
    end
  end

  def success
    puts ",adPPYba, 88       88  ,adPPYba,  ,adPPYba,  ,adPPYba, ,adPPYba, ,adPPYba,  ".green
    puts "I8[    \"\" 88       88 a8\"     \"\" a8\"     \"\" a8P_____88 I8[    \"\" I8[    \"\"  ".green
    puts " `\"Y8ba,  88       88 8b         8b         8PP\"\"\"\"\"\"\"  `\"Y8ba,   `\"Y8ba,   ".green
    puts "aa    ]8I \"8a,   ,a88 \"8a,   ,aa \"8a,   ,aa \"8b,   ,aa aa    ]8I aa    ]8I  ".green
    puts "`\"YbbdP\"'  `\"YbbdP'Y8  `\"Ybbd8\"'  `\"Ybbd8\"'  `\"Ybbd8\"' `\"YbbdP\"' `\"YbbdP\"'  ".green
  end

  def failed
    puts "   ad88            88 88                     88  ".red
    puts "  d8\"              \"\" 88                     88  ".red
    puts "  88                  88                     88  ".red
    puts "MM88MMM ,adPPYYba, 88 88  ,adPPYba,  ,adPPYb,88  ".red
    puts "  88    \"\"     `Y8 88 88 a8P_____88 a8\"    `Y88  ".red
    puts "  88    ,adPPPPP88 88 88 8PP\"\"\"\"\"\"\" 8b       88  ".red
    puts "  88    88,    ,88 88 88 \"8b,   ,aa \"8a,   ,d88  ".red
    puts "  88    `\"8bbdP\"Y8 88 88  `\"Ybbd8\"'  `\"8bbdP\"Y8  ".red
  end
end