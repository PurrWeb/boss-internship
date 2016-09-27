require "shellwords"

namespace :data do
  desc "dump the production database and load the data into your develpment database"
  task :load_production_dump => ["db:drop", "db:create"] do
    sh "#{production_dump_command} > tmp/boss_production_dump.sql"
    sh "cat #{local_production_dump_path} | mysql -u root boss_development"
  end

  task :reload_local_dump => ["db:drop", "db:create"] do
    sh "cat #{local_production_dump_path} | mysql -u root boss_development"
  end

  desc "sync staging environment database with production"
  task :sync_staging do
    db = "boss_staging"
    cmds = "mysqladmin -u root drop #{db} create #{db}; #{production_dump_command} | mysql -u root #{db}"
    sh "ssh -A ubuntu@staging-boss.jsmbars.co.uk bash -e -x -o pipefail -c '#{Shellwords.shellescape(cmds)}'", verbose: false
  end

  def production_dump_command
    "ssh ubuntu@boss.jsmbars.co.uk mysqldump -u root --add-drop-table boss_production"
  end

  def local_production_dump_path
    'tmp/boss_production_dump.sql'
  end
end
