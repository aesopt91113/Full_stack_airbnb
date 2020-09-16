json.bookings do
  json.array! @bookings do |booking|
    json.id booking.id
    json.start_date booking.start_date
    json.end_date booking.end_date
    json.user booking.user.username
    
    json.property do
      json.id booking.property.id
      json.title booking.property.title
    end

    # booking.charges
    
    completed_charge = booking.charges.find_by(complete:true)
    if completed_charge.present? 
      json.charge do 
        json.id completed_charge.id
        json.currency completed_charge.currency
        json.amount completed_charge.amount
        json.complete completed_charge.complete
      end
    end
  end
end
