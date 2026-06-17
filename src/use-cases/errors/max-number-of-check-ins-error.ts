export class MaxNumberOfCheckInsError extends Error {
	constructor() {
		super('Max number of checkins reached.')

		this.name = 'MaxNumberOfCheckInsError'
	}
}
