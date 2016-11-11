require 'sinatra'
require 'json'

get '/' do
  html :index
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do
  file = File.read('data.json')

  # check if file is empty
  my_favorites = file.empty? ? [] : JSON.parse(file)

  # check if the movie is already on the list
  if my_favorites.map { |movie| movie['oid'] }.include?(params[:oid])
    return { error: :duplicate }.to_json
  end

  # add movie to the list of favorites
  new_movie = { name: params[:name], oid: params[:oid] }
  my_favorites << new_movie

  # overwrite data.json to make new
  File.write('data.json', JSON.pretty_generate(my_favorites))

  # render
  new_movie.to_json
end


# if we changed templates to erb you can just do => erb :index
# this allows us to pretty much do that by 'rendering' into any static file in the public directory
def html(view)
  File.read(File.join('public', "#{view.to_s}.html"))
end
