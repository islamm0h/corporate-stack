const http = require('http')

const data = JSON.stringify({})

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/reset-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

console.log('🗑️ Starting data reset...')

const req = http.request(options, (res) => {
  let body = ''
  
  res.on('data', (chunk) => {
    body += chunk
  })
  
  res.on('end', () => {
    try {
      const result = JSON.parse(body)
      console.log('✅ Reset completed!')
      console.log('Response:', result)
    } catch (e) {
      console.log('Raw response:', body)
    }
  })
})

req.on('error', (e) => {
  console.error('❌ Error:', e.message)
})

req.write(data)
req.end()
