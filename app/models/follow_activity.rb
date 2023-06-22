class FollowActivity < Activity
    def html
        "<a href='/#{self.user.handle}' class='text-xl no-underline font-bold'>#{self.user.name}</a> followed <a href='/#{self.record.handle}' class='text-xl no-underline font-bold'>#{self.record.name}</a>"
    end

    def icon
        "fa-solid fa-user-plus"
    end

    def image_url
        self.record.profile_picture_url
    end

    def href
        "/#{self.record.handle}"
    end
end