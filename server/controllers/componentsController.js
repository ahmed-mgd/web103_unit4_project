import { pool } from '../config/database.js'

export const getComponentsByType = async (req, res) => {
  const { type } = req.params
  const validTypes = ['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'case']

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid component type' })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM pc_components WHERE type = $1 ORDER BY price ASC',
      [type]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllComponents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pc_components ORDER BY type, price ASC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
