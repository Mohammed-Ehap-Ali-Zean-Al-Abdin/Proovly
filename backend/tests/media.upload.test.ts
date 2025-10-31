import request from 'supertest'
import app from '../src/app'

// Mock storage to avoid requiring real Cloudinary env in route test
jest.mock('../src/services/storage/index', () => ({
  getStorage: () => ({
    uploadBuffer: async (_buffer: Buffer, name?: string) => ({
      cid: `mock_${name || 'file'}`,
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
    })
  })
}))

async function loginAsNgo() {
  const email = `ngo_${Date.now()}@test.com`
  const signup = await request(app)
    .post('/api/v1/auth/signup')
    .send({ email, password: 'pass1234', name: 'NGO', role: 'ngo' })
  expect(signup.status).toBe(201)
  return signup.body.token as string
}

describe('Media upload', () => {
  it('uploads a file via /media/upload and returns url+cid', async () => {
    const token = await loginAsNgo()
    const res = await request(app)
      .post('/api/v1/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('hello world'), 'hello.txt')
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('url')
    expect(res.body).toHaveProperty('cid')
  })

  it('requires authentication and a file', async () => {
    const noAuth = await request(app).post('/api/v1/media/upload')
    expect(noAuth.status).toBe(401)

    const token = await loginAsNgo()
    const noFile = await request(app)
      .post('/api/v1/media/upload')
      .set('Authorization', `Bearer ${token}`)
    expect(noFile.status).toBe(400)
  })
})
