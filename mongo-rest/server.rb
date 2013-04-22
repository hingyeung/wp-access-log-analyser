require "sinatra"
require "mongo"
require "uri"
require "json"

include Mongo

before do
  if request.request_method == 'OPTIONS'
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET"
    response.headers["Access-Control-Allow-Headers"] = "origin, content-type, accept, X-Requested-With"

    halt 200
  end
end

get '/count/:db/:coll' do
  response.headers["Access-Control-Allow-Origin"] = "*"
  query = JSON.parse(URI.unescape(params['query'])) unless params['query'].nil?
  db = MongoClient.new("localhost", 27017).db(params['db'])
  db[params['coll']].find(query).count.to_s
end

get '/demo/:db/:coll' do
  response.headers["Access-Control-Allow-Origin"] = "*"
  "#{params['query'].nil?} #{params['db']} - #{params['coll']} - #{params['query']}"
end
