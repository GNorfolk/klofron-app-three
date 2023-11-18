module.exports = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: 'http://localhost:3001/v1/:path*'
      },
      {
        source: '/v2/:path*',
        destination: 'http://localhost:5000/v2/:path*'
      }
    ]
  }
}