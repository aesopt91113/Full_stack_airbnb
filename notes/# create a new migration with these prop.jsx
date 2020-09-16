# create a new migration with these properties
create_table "property_images", force: :cascade do |t|
  t.string "image_url"
  t.integer "property_id"
  t.index ["user_id"], name: "index_properties_on_user_id"
end

# in properties/index.jbuilder and properties/show.jbuilder replace json.image_url with this
json.array! property.property_images do |image|
  json.id image.id
  json.image_url image.image_url
end

# model/property.rb
has_many :property_images

accepts_nested_attributes_for :property_images, reject_if: :all_blank, allow_destroy: true

# model/property_image.rb
belongs_to :property

# controllers/api/hosting_controller.rb
params.require(:property).permit(
  :title,
  :description,
  :city,
  :country,
  :property_type,
  :price_per_night,
  :max_guests,
  :bedrooms,
  :beds,
  :baths,
  property_image_attributes: [ :id, :image_url, :_destroy]
)

# AJAX Data format when you Create/Update
const params = {
  title: '',
  description: '',
  city: '',
  country: '',
  property_type: '',
  price_per_night: '',
  max_guests: '',
  bedrooms: '',
  beds: '',
  baths: '',
  property_image_attributes: [
    { id: 1, image_url: File }, # Change Exsisting File by changing image_url
    { id: 2, _destroy: true }, # Destroy a file
    { image_url: File }, # Add New File
  ]
}