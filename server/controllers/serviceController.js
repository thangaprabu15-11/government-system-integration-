const store = require('../utils/store');

const getAllServices = (req, res) => {
  res.json({
    success: true,
    count: store.services.length,
    services: store.services
  });
};

const getServiceById = (req, res) => {
  const service = store.services.find(s => s.serviceId === req.params.id || s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found in catalogue' });
  }

  res.json({
    success: true,
    service
  });
};

module.exports = { getAllServices, getServiceById };
