class CreateBookings < ActiveRecord::Migration[5.2]
  def change
    create_table :bookings do |t|
      t.date :start_date
      t.date :end_date
      t.belongs_to :user
      t.belongs_to :property
      t.timestamps
    end
  end
end
