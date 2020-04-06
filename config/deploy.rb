# frozen_string_literal: true

# config valid for current version and patch releases of Capistrano
lock "~> 3.12.1"

set :application, "audio-receiver"
set :repo_url, "git@github.com:mercuryanalytics/audio-receiver.git"

set :rbenv_ruby, "2.6.3"

set :deploy_to, "/var/www/rails"

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/master.key"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

set :log_level, :info

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
