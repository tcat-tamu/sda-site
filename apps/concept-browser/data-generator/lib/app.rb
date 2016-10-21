require 'active_record'
require 'optparse'
require 'yaml'

# Application-wide module for application services
module App
  def self.logger
    @logger
  end

  def self.logger=(logger)
    @logger = logger
  end

  def self.environment
    @environment
  end

  def self.environment=(env)
    @environment = env
  end

  def self.boot(options)
    db_configs = YAML.load_file(File.expand_path('../../config/database.yml', __FILE__))

    options[:environment] ||= 'development'
    unless db_configs.key? options[:environment]
      puts "unknown environment #{options[:environment]}"
      exit
    end
    App.environment = options[:environment]

    App.logger = Logger.new(STDERR)
    App.logger.level = options[:logger_level] || Logger::INFO
    App.logger.formatter = proc do |severity, datetime, _progname, message|
      timestr = datetime.strftime '%FT%T%:z'
      "#{timestr} [#{severity}]: #{message}\n"
    end

    App.logger.debug('logger active')

    App.logger.info("connecting to #{App.environment} database")
    db_config = db_configs[App.environment]
    db_args = %w(adapter username password host port database).map { |k| db_config[k] }
    App.logger.debug(format('%s://%s:%s@%s:%s/%s', *db_args))
    ActiveRecord::Base.establish_connection(db_config)

    App.logger.debug('boot complete')
  end

  # global option parsing
  class BaseOptionParser
    def self.parse(args, defaults = {})
      @options = defaults
      parser = new.option_parser
      yield(parser, @options) if block_given?
      parser.parse!(args)
      @options
    end

    def option_parser
      @parser ||= OptionParser.new do |parser|
        parser.banner = "Usage: #{parser.program_name} [options]"

        env_option(parser)
        quiet_option(parser)
        verbose_option(parser)

        parser.on_tail('-h', '--help', 'Show this message') do
          puts parser
          exit
        end
      end

      @parser
    end

    def env_option(parser)
      parser.on('-e ENV', '--env=ENV', 'set runtime environment') do |e|
        @options[:environment] = e
      end
    end

    def quiet_option(parser)
      parser.on('-q', '--quiet', 'suppress non-error-related output') do
        @options[:logger_level] = Logger::WARN
      end
    end

    def verbose_option(parser)
      parser.on('-v', '--verbose', 'output detailed messages') do
        @options[:logger_level] = Logger::DEBUG
      end
    end
  end
end
