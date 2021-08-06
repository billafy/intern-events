const currentDateTimestamp = () => {
	const current = new Date()

	const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

	const minutes = '0' + current.getMinutes().toString()
	const hours = '0' + current.getHours().toString()

	const time = `${hours.slice(hours.length - 2, 3)}:${minutes.slice(minutes.length - 2, 3)}`
	return date + ' - ' + time
}

const getFormattedDate = (ms) => {
	const date = new Date(ms)
	const day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear()
	if(isNaN(day) || isNaN(month) || isNaN(year))
		return false
	return `${day}/${month}/${year}`
}

module.exports = {
	currentDateTimestamp,
	getFormattedDate
}