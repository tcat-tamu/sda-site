# relates two works to each other
class Relationship < ActiveRecord::Base
  Types = {
    'uk.ac.ox.bodleian.sda.relationships.influence' => {
      identifier: 'uk.ac.ox.bodleian.sda.relationships.influence',
      title: 'Influenced',
      reverseTitle: 'Influenced By',
      description: nil,
      isDirected: true
    },
    'uk.ac.ox.bodleian.sda.relationships.consonance' => {
      identifier: 'uk.ac.ox.bodleian.sda.relationships.consonance',
      title: 'Consonance',
      reverseTitle: nil,
      description: nil,
      isDirected: false
    },
    'uk.ac.ox.bodleian.sda.relationships.provoked' => {
      identifier: 'uk.ac.ox.bodleian.sda.relationships.provoked',
      title: 'Provoked',
      reverseTitle: 'Provoked By',
      description: nil,
      isDirected: true
    },
    'uk.ac.ox.bodleian.sda.relationships.patternmatch' => {
      identifier: 'uk.ac.ox.bodleian.sda.relationships.patternmatch',
      title: 'Possible Pattern Match',
      reverseTitle: nil,
      description: '2+ works appear directly related w/o explicit dependency.',
      isDirected: false
    }
  }.freeze

  self.table_name = :relationships
end
