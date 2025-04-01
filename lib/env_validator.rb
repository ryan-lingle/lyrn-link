module EnvValidator
  REQUIRED_VARS = [
    'JWT_SECRET',
    'POSTMARK_TOKEN',
    'AWS_ACCESS_KEY_ID',
    'AWS_ACCESS_KEY',
    'DOMAIN',
    'ROLLBAR_ACCESS_TOKEN',
    'TWITTER_KEY',
    'TWITTER_SECRET_KEY',
    'OPEN_AI_KEY',
    'TADDY_API_KEY',
    'S3_BUCKET'
  ].freeze

  def self.validate!
    missing_vars = REQUIRED_VARS.select { |var| ENV[var].nil? || ENV[var].empty? }
    
    if missing_vars.any?
      raise "Missing required environment variables: #{missing_vars.join(', ')}"
    end
  end
end 