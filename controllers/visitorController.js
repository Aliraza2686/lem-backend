import Visitor from '../modals/Visitor.js';
import fetch from 'node-fetch';

// POST /api/visitors/track  — called by your website
export const trackVisitor = async (req, res) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress;

    // Get location from IP
    let country = 'Unknown', city = 'Unknown', region = 'Unknown';
    try {
      const geo = await fetch(`http://ip-api.com/json/${ip}`);
      const geoData = await geo.json();
      if (geoData.status === 'success') {
        country = geoData.country;
        city = geoData.city;
        region = geoData.regionName;
      }
    } catch (_) {}

    const { device, browser, os, page, referrer } = req.body;

    const visitor = await Visitor.create({
      ip, country, city, region,
      device, browser, os, page, referrer
    });

    res.status(201).json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/visitors  — for your admin dashboard
export const getVisitors = async (req, res) => {
  try {
    // query params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page - 1) * limit

    // fetch data
    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Visitor.countDocuments()

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      visitors,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}