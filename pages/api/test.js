// Simple test API route that doesn't require authentication
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      method: req.method 
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}