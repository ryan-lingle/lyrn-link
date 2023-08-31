module Feedable

    def feed(following: [], bookmarks: [])
        activity_set.map do |fa|
            fa.to_index_res(following)
        end
    end
end