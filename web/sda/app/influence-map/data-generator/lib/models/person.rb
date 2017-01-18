require 'models/work'

# represents a historical figure
class Person < ActiveRecord::Base
  self.table_name = :people

  class Name
    attr_accessor :title, :first, :middle, :last, :suffix, :display

    def initialize(hash = nil)
      unless hash.nil?
        @title = hash['title']
        @first = hash['givenName'] || hash['first']
        @middle = hash['middleName'] || hash['middle']
        @last = hash['familyName'] || hash['last']
        @suffix = hash['suffix']
        @display = hash['display']
      end
    end

    def to_s
      display || [title, first, middle, last, suffix] \
        .reject { |o| o.nil? || o.empty? } \
        .map(&:strip).join(' ')
    end
  end

  def name
    Name.new(historical_figure['displayName'] || historical_figure['names'].first)
  end

  def birth
    event_to_date(historical_figure['birth'])
  end

  def death
    event_to_date(historical_figure['death'])
  end

  def works
    Work.all.select { |work| work.author? id }
  end

  private

  def event_to_date(e)
    d = e && e['date']

    date = begin
      Time.parse(d['calendar'])
    rescue
      nil
    end

    {
      description: d && d['description'],
      location: e && e['location'],
      date: d && d['calendar'] && date
    }
  end
end
