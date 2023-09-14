class ItemPostActivity < Activity
    def html
        "<a href='/#{self.owner.handle}' class='no-underline font-bold'>#{self.owner.name}</a> posted <a href='/#{self.record.owner.handle}/i/#{self.record.id}' class='no-underline font-bold'>#{self.record.title}</a>"
    end

    def icon
        "fa-solid fa-pencil"
    end

    def image_url
        self.record.image_url
    end

    def href
        record.href
    end
end