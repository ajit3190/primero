source 'https://rubygems.org'
ruby '2.6.2'

gem 'rails',            '5.2.3'
gem 'pg',               '~> 1.1'
gem 'rake',             '~> 12.3'
gem 'puma',             '~> 3.12'
gem 'webpacker',        '~> 4.0'
gem 'devise',           '4.6.2'

# TODO: Keeping cancancan at 1.9.2 for now. Newer versions seem to break. Newer
# version has method changes https://github.com/CanCanCommunity/cancancan/blob/develop/CHANGELOG.md
# Will require changes to authorization to upgrade
gem 'cancancan',         '1.9.2'

gem 'prawn',             '~> 2.2'
gem 'prawn-table',       '~> 0.2'
gem 'arabic-letter-connector', git: 'https://github.com/Quoin/arabic-letter-connector', branch: 'support-lam-alef-ligatures'
gem 'twitter_cldr',      '~> 4.4'

# TODO: We should replace xls exporting with https://github.com/randym/axlsx or
# https://github.com/Paxa/fast_excel both supports streaming. The last options
# has less dependencies. Will require some rework of exporter
gem 'rubyzip',           '~> 1.2', require: 'zip'
gem 'writeexcel',        '~> 1.0'
gem 'spreadsheet',       '~> 1.1'

gem 'will_paginate',     '~> 3.1'
gem 'mini_magick',       '~> 4.9'
gem 'i18n-js',           '~> 3.2'

gem 'rufus-scheduler',   '~> 3.4', require: false
gem 'backburner',        '~> 1.5', require: false
gem 'deep_merge',        '~> 1.2', require: 'deep_merge/rails_compat'

gem 'tzinfo',            '~> 1.2'
gem 'tzinfo-data',       '~> 1.2019'

# Note: if upgrading Sunspot, update the corresonding version of Solr in Chef if necessaary.
# Current Solr version is 5.3.1
gem 'sunspot_rails',     '2.3.0'
gem 'sunspot_solr',      '2.3.0'

# TODO: Remove/reevaluate the following once UIUX rebuilt
gem 'therubyracer',      '~> 0.12', platforms: :ruby, require: 'v8'
gem 'jquery-rails',      '4.3.1'
gem 'ejs',               '~> 1.1'
gem 'foundation-rails',  '6.3.0.0' # NOTE: Don't update
gem 'sass-rails',        '~> 5.0'
gem 'compass-rails',     '~> 3.1'
gem 'chosen-rails',      '1.5.2'
gem 'jquery-turbolinks', '~> 2.1'
gem 'turbolinks',        '~> 5'
gem 'momentjs-rails',    '~> 2.20'
gem 'yui-compressor',    '~> 0.12'
gem 'closure-compiler',  '~> 1.1'
gem 'uglifier',          '~> 4.1'
# ---

group :development do
  gem 'i18n-tasks',                 '~> 0.9'
  gem 'better_errors',              '~> 2.5'
  gem 'binding_of_caller',          '~> 0.8'
  gem 'ruby-prof',                  '~> 0.17'
  gem 'request_profiler',           '~> 0.0', :git => 'https://github.com/justinweiss/request_profiler.git'
  gem 'rack-mini-profiler',         '>= 1.0.0', require: false
  gem 'memory-profiler',            '~> 1.0'
  gem 'letter_opener',              '~> 1.7'
  gem 'rails-controller-testing',   '~> 1.0'
  gem 'factory_bot',                '~> 5.0'
  gem 'rspec-activemodel-mocks',    '~> 1.1'
  gem 'rspec-collection_matchers',  '~> 1.1'
  gem 'rspec',                      '~> 3.8'
  gem 'rspec-rails',                '~> 3.8'
  gem 'rspec-instafail',            '~> 1.0'
  gem 'hpricot',                    '~> 0.8'
  gem 'json_spec',                  '~> 1.1'
  gem 'rubocop',                    '~> 0.67'
  gem 'rubocop-performance',        '~> 1.1'
  gem 'simplecov',                  '~> 0.16'
  gem 'simplecov-rcov',             '~> 0.2'
  gem 'ci_reporter',                '~> 2.0'
  gem 'rack_session_access',        '~> 0.2'
  # TODO: Latest version (1.2.5) of this conflicts with sunspot gem. We should be able to upgrade when we upgrade sunspot
  gem 'timecop',                    '~>0.9.1'
  gem 'rack-test',                  '~> 1.1'
  gem 'foreman'
  gem 'pry'
  gem 'pry-byebug'
  gem 'sunspot_test', require: false

  # TODO: Remove/reevaluate the following once UIUX rebuilt
  gem 'selenium-webdriver',         '~> 3.14'
  gem 'chromedriver-helper',        '~> 2.1'
  gem 'capybara-selenium',          '~> 0.0'
  gem 'capybara',                   '~> 3.16'
  # ---
end
