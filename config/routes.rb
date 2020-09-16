Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  
  # assignment success page
  get '/booking/:booking_id/success' => 'static_pages#success_booking'
  # list user's booking
  # private
  get '/bookings/user/:username/user_booking' => 'static_pages#show_myBookings'
  
  # HOSTING HOME
  # private
  get '/host/homes/:username/user_home' => 'static_pages#show_hostHomes'
  get '/host/homes' => 'static_pages#hostHomes' 
  get '/host/homes/:username/user_home/:property_id/bookings' => 'static_pages#property_bookings'

  # ------------------------------------------------------------------------------------------------------------------------------
  namespace :api do
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    
    # Bookings
    get '/booking' => 'bookings#index'
    delete '/booking/:id' => 'bookings#destroy'

    # Hosting
    get '/hosting/:id' => 'hosting#all_guests_bookings'
    delete '/hosting/:id/imageDelete' => 'hosting#delete_image_only'

    # Session
    get '/authenticated' => 'sessions#authenticated'
    delete '/sessions' => 'sessions#destroy'

    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'

    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show]
    resources :bookings, only: [:create, :index, :show, :update]
    resources :charges, only: [:create]
    resources :hosting, except: [:new, :edit]
  end
end

