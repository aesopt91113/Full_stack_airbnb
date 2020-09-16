class StaticPagesController < ApplicationController
  def home
    render 'home'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end
  
  def login
    render 'login'
  end
  
  def success_booking
    render 'success_booking'
  end 

  def hostHomes
    render 'hostHomes'
  end

  def show_hostHomes
    render 'show_hostHomes'
  end

  def show_myBookings
    render 'show_myBookings'
  end

  def property_bookings
    render 'property_bookings'
  end
end
