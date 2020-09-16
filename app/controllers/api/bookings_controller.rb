module Api
  class BookingsController < ApplicationController
    before_action :authenticate_user

    def index
      @bookings = @session.user.bookings
      
      render 'api/bookings/index', status: :ok      
    end

    def show
      @booking = @session.user.bookings.find_by(id: params[:id])

      render 'api/bookings/show', status: :ok
    end

    def create
      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      begin
        @booking = Booking.create({ user_id: @session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date]})
        render 'api/bookings/create', status: :created
      rescue ArgumentError => e
        render json: { error: e.message }, status: :bad_request
      end
    end

    def destroy 
      @booking = @user.bookings.find_by(id: params[:id])

      if @booking.destroy
        render 'api/bookings/index', status: :ok
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      @bookings = property.bookings.where("end_date > ? ", Date.today)
      
      render 'api/bookings/index'
    end

    private

    def booking_params
      params.require(:booking).permit(:property_id, :start_date, :end_date)
    end

    def authenticate_user
      @token = cookies.signed[:airbnb_session_token]
      @session = Session.find_by(token: @token)
      @user = @session.user
  
      return render json: { error: 'user not logged in' }, status: :unauthorized if !@session
    end
  end
end
