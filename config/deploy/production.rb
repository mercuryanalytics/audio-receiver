# frozen_string_literal: true

server "audio-receiver.us-east-1", user: "deployer", roles: %w[app web db]

set :ssh_options, forward_agent: true
