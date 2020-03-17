class CreateParts < ActiveRecord::Migration[6.0]
  def change
    create_table :parts do |t|
      t.references :medium, null: false, foreign_key: true
      t.integer :sequence_number, null: false
      t.binary :blob, null: false

      t.timestamps
    end
  end
end
