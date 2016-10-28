# Represents a work/edition/volume hierarchy
class Work < ActiveRecord::Base
  self.table_name = :works

  def author?(author_id)
    has_author = -> (rs) { rs.any? { |r| r['authorId'] == author_id } }
    w = work
    has_author.call(w['authors']) || w['editions'].any? do |e|
      has_author.call(e['authors']) || e['volumes'].any? do |v|
        has_author.call(v['authors'])
      end
    end
  end
end
