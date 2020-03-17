Aws.config[:region] = 'us-east-1'
Aws.config[:credentials] = begin
                             creds = Aws::SharedCredentials.new
                             creds = Aws::InstanceProfileCredentials.new unless creds.set?
                             creds
                           end
