json.booking do
  json.id @booking.id
  json.start_date @booking.start_date
  json.end_date @booking.end_date

  json.property do
    json.id @booking.property.id
    json.title @booking.property.title
  end

  # json.charges @booking.charges do |charge|
  #   json.id charge.id
  #   json.currency charge.currency
  #   json.amount charge.amount
  #   json.complete charge.complete
  # end

  completed_charge = @booking.charges.find_completed
  if completed_charge.present? 
    json.charge do 
      json.id completed_charge.id
      json.currency completed_charge.currency
      json.amount completed_charge.amount
      json.complete completed_charge.complete
    end
  end
end

