module TimeSinceable
	def time_since
		diff = Time.now - created_at
		minutes = get_minutes(diff)
		if minutes < 1
			"Just now"
		elsif minutes < 60
			stringify(minutes, "minute")
		else
			hours = get_hours(diff)
			if hours < 24
				stringify(hours, "hour")
			else
				days = get_days(diff)
				if days < 7
					stringify(days, "day")
				else
					weeks = get_weeks(diff)
					if weeks < 6
						stringify(weeks, "week")
					else
						months = get_months(diff)
						if months < 12
							stringify(months, "month")
						else
							years = get_years(diff)
							stringify(years, "year")
						end
					end
				end
			end
		end
	end

	private

	def get_minutes(diff)
		diff.to_i / 60
	end

	def get_hours(diff)
		diff.to_i / (60 * 60)
	end

	def get_days(diff)
		diff.to_i / (24 * 60 * 60)
	end

	def get_weeks(diff)
		diff.to_i / (7 * 24 * 60 * 60)
	end

	def get_months(diff)
		diff.to_i / (30 * 24 * 60 * 60)
	end

	def get_years(diff)
		diff.to_i / (365 * 24 * 60 * 60)
	end

	def stringify(n, string)
		if n > 1
			n.to_s + " " + string + "s" + " ago"
		else
			n.to_s + " " + string + " ago"
		end
	end
end