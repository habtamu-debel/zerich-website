// server/routes/auth.routes.js
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, full_name: req.user.full_name, role: req.user.role } });
});