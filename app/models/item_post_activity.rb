class ItemPostActivity < Activity
    def html
        "<a href='/#{self.user.handle}' class='text-xl no-underline font-bold'>#{self.user.name}</a> posted <a href='/#{self.record.user.handle}/i/#{self.record.id}' class='text-xl no-underline font-bold'>#{self.record.title}</a>"
    end

    def icon
        "fa-solid fa-pencil"
    end

    def image_url
        self.record.image_url
    end

    def href
        "/#{self.user.handle}/i/#{self.record.id}"
    end
end