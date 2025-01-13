class Taddy

    def self.find_podcast(title)
        body = { query: "{ getPodcastSeries(name:\"#{title}\") { uuid name itunesId description imageUrl rssUrl } }" }.to_json
        res = Curl.post("https://api.taddy.org", body) { |http|
            http.headers["Content-Type"] = "application/json"
            http.headers["X-USER-ID"] = "631"
            http.headers["X-API-KEY"] = ENV["TADDY_API_KEY"]
        }
        res = JSON.parse(res.body_str)
        if res["data"]
            res["data"]["getPodcastSeries"]
        end

    end

    def self.find_by_itunes_id(itunes_id)
        body = { query: "{ getPodcastSeries(itunesId: #{itunes_id}) { uuid name itunesId description imageUrl rssUrl } }" }.to_json
        res = Curl.post("https://api.taddy.org", body) { |http|
            http.headers["Content-Type"] = "application/json"
            http.headers["X-USER-ID"] = "631"
            http.headers["X-API-KEY"] = ENV["TADDY_API_KEY"]
        }
        res = JSON.parse(res.body_str)
        if res["data"]
            res["data"]["getPodcastSeries"]
        end
    end

    def self.find_podcast_by_id(id)
        body = { query: "{ getPodcastSeries(uuid:\"#{id}\") { uuid name itunesId description imageUrl rssUrl } }" }.to_json
        res = Curl.post("https://api.taddy.org", body) { |http|
            http.headers["Content-Type"] = "application/json"
            http.headers["X-USER-ID"] = "631"
            http.headers["X-API-KEY"] = ENV["TADDY_API_KEY"]
        }
        res = JSON.parse(res.body_str)
        if res["data"]
            res["data"]["getPodcastSeries"]
        end
    end

end