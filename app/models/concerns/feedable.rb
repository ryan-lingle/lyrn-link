module Feedable

    def feed(is_current_user: false, is_group: false)
        # if current user or group show following/group activities else show only current user activities
        (is_current_user || is_group ? activity_set : activities).map do |fa|
            fa.to_index_res
        end
    end
end