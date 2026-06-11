import { env } from '@/utils/env'
import { app } from './app'

app.listen({
	host: '0.0.0.0',
	port: env.PORT
}).then((address) => {
	console.log(`Server is running on ${address} 🚀`)
})
