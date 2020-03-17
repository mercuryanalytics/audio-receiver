# frozen_string_literal: true

class Part < ApplicationRecord
  belongs_to :medium

  scope :in_sequence, -> { order(:sequence_number) }
  scope :lite, -> { select((column_names - ["blob"]).map { |n| "`#{table_name}`.`#{n}`" }) }

  validates :sequence_number, uniqueness: { scope: :medium_id }

  def upload_description(base)
    base.merge(body: StringIO.new(blob), part_number: sequence_number)
  end
end
