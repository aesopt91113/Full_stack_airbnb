module Api
  class HostingController < ApplicationController
    before_action :authenticate_user
    before_action :current_property, except: [:index, :create]
    skip_before_action :verify_authenticity_token

    def index
      @properties = Property.where(user_id: @session.user_id)

      render 'api/hostings/index', status: :ok
    end

    def create
      @property = @user.properties.new(property_params)
      @property.images.attach(params[:property][:images]) 

      if @property.save
        render 'api/properties/show', status: :created
      else
        render json: { success: false, errors: @property.errors.messages }, status: :bad_request
      end
    end

    def update
      @property.assign_attributes(property_params)
      @property.images.attach(params[:property][:images]) if params[:property][:images]

      if @property.save
        render 'api/properties/show', status: :ok
      else
        render json: { success: false, errors: @property.errors.messages }, status: :bad_request
      end
    end

    def delete_image_only
      attachment = @property.images.find_by(id: params[:property][:attachment_id])

      if attachment
        attachment.purge
        
        render 'api/properties/show', status: :ok
      else
        render json: { success: false }, status: :bad_request
      end
    end 

    def destroy
      if @property.destroy
        render json: { sucess: true }, status: :ok
      else
        render json: { success: false }, status: :bad_request
      end
    end
  
    def all_guests_bookings
      @bookings = @property.bookings

      render 'api/bookings/index', status: :ok
    end 

    private

    def property_params
      params.require(:property).permit(
        :title,           # "property[title]"
        :description,     # "property[description]"
        :city,            # "property[city]"
        :country,         # "property[country]"
        :property_type,   # "property[property_type]"
        :price_per_night, # "property[price_per_night]"
        :max_guests,      # "property[max_guests]"
        :bedrooms,        # "property[bedrooms]"
        :beds,            # "property[beds]"
        :baths,           # "property[baths]"
        :user_id,         # "property[user_id]"
      )
    end
  
    def authenticate_user
      @token = cookies.signed[:airbnb_session_token]
      @session = Session.find_by(token: @token)
      @user = @session.user
  
      return render json: { error: 'user not logged in' }, status: :unauthorized if !@session
    end
  
    def current_property
      @property = Property.find_by(id: params[:id], user_id: @session.user_id)
      
      return render json: { error: 'not_found' }, status: :not_found if !@property
    end
  end 
end
