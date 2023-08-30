class NotesActivity < Activity
    def html
        "<div><a href='/#{self.user.handle}' class='text-xl no-underline font-bold'>#{self.user.name}</a> created notes on <a href='#{self.record.href}' class='text-xl no-underline font-bold'>#{self.record.title}</a><div class='text-groundwork-gray-dark mt-3'>#{metadata[:notes]}</div></div>"
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