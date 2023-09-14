class NotesActivity < Activity
    def html
        "<div><a href='/#{self.owner.handle}' class='no-underline font-bold'>#{self.owner.name}</a> created notes on <a href='#{self.record.href}' class='no-underline font-bold'>#{self.record.title}</a><div class='text-groundwork-gray-dark mt-3'></div></div>"
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