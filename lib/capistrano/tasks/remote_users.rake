# frozen_string_literal: true

namespace :admin do
  desc "Update authorized keys for deployer"
  task :authorized_keys do
    on roles(:app) do
      execute :wget,
              "--quiet",
              "--output-document=.ssh/authorized_keys",
              "https://talaria-production.s3.amazonaws.com/authorized_keys"
      execute :chmod, "0600", ".ssh/authorized_keys"
    end
  end
end
