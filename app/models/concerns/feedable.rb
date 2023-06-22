module Feedable

    def feed(following: [], bookmarks: [])
        follower_activities.map do |fa|
            fa.to_index_res(following)
        end
    end
end