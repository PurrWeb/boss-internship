require "shellwords"

namespace :data do
  def local_dump_path
    'tmp/boss_development.sql'
  end

  desc "dump the production database and load the data into your develpment database"
  task :load_production_dump => ["db:drop", "db:create"] do
    now = Time.current
    production_dump_filename = "boss_production_#{now.strftime('%Y-%m-%d_%H-%M-%S')}.sql"
    production_dump_path = "tmp/#{production_dump_filename}"

    sh "#{production_dump_command} > #{production_dump_path}"
    raise 'Command failed' if $? != 0

    sh "cp #{production_dump_path} #{local_dump_path}"
    raise 'Command failed' if $? != 0

    sh "cat #{local_dump_path} | mysql -u root boss_development"
    raise 'Command failed' if $? != 0
  end

  desc "load dump at #{local_dump_path} into development database"
  task :reload_local_dump => ["db:drop", "db:create"] do
    sh "cat #{local_dump_path} | mysql -u root boss_development"
    raise 'Command failed' if $? != 0
  end

  desc "sync staging environment database with production"
  task :sync_staging do
    db = "boss_staging"
    cmds = "mysqladmin -u root drop #{db} create #{db}; #{production_dump_command} | mysql -u root #{db} && sudo dokku run staging bundle exec rake data:overwrite_avatars"
    sh "ssh -A ubuntu@staging-boss.jsmbars.co.uk bash -e -x -o pipefail -c '#{Shellwords.shellescape(cmds)}'", verbose: false
  end

  desc "Removes avatar urls for all staff members non production environments"
  task :overwrite_avatars => :environment do
    StaffMember.update_all(avatar: nil)
  end

  desc "Anonymise all data in development database and set up a single dev user with standard username and password"
  task :anonymise_database => :environment do
    AnonymiseDatabase.new.call
  end

  def production_dump_command
    "ssh ubuntu@boss.jsmbars.co.uk mysqldump -u root --add-drop-table boss_production"
  end
end
