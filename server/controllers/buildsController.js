import { pool } from '../config/database.js'

export const getAllBuilds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id, b.build_name, b.total_price, b.created_at,
        cpu.id as cpu_id, cpu.name as cpu_name, cpu.price as cpu_price,
        gpu.id as gpu_id, gpu.name as gpu_name, gpu.price as gpu_price,
        ram.id as ram_id, ram.name as ram_name, ram.price as ram_price,
        storage.id as storage_id, storage.name as storage_name, storage.price as storage_price,
        pc_case.id as case_id, pc_case.name as case_name, pc_case.price as case_price, pc_case.specs as case_specs,
        mb.id as motherboard_id, mb.name as motherboard_name, mb.price as motherboard_price
      FROM pc_builds b
      JOIN pc_components cpu ON b.cpu_id = cpu.id
      JOIN pc_components gpu ON b.gpu_id = gpu.id
      JOIN pc_components ram ON b.ram_id = ram.id
      JOIN pc_components storage ON b.storage_id = storage.id
      JOIN pc_components pc_case ON b.case_id = pc_case.id
      JOIN pc_components mb ON b.motherboard_id = mb.id
      ORDER BY b.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBuildById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(`
      SELECT
        b.id, b.build_name, b.total_price, b.created_at,
        cpu.id as cpu_id, cpu.name as cpu_name, cpu.price as cpu_price, cpu.specs as cpu_specs, cpu.brand as cpu_brand,
        gpu.id as gpu_id, gpu.name as gpu_name, gpu.price as gpu_price, gpu.specs as gpu_specs,
        ram.id as ram_id, ram.name as ram_name, ram.price as ram_price, ram.specs as ram_specs,
        storage.id as storage_id, storage.name as storage_name, storage.price as storage_price, storage.specs as storage_specs,
        pc_case.id as case_id, pc_case.name as case_name, pc_case.price as case_price, pc_case.specs as case_specs, pc_case.form_factor as case_form_factor,
        mb.id as motherboard_id, mb.name as motherboard_name, mb.price as motherboard_price, mb.specs as motherboard_specs, mb.brand as motherboard_brand, mb.form_factor as motherboard_form_factor
      FROM pc_builds b
      JOIN pc_components cpu ON b.cpu_id = cpu.id
      JOIN pc_components gpu ON b.gpu_id = gpu.id
      JOIN pc_components ram ON b.ram_id = ram.id
      JOIN pc_components storage ON b.storage_id = storage.id
      JOIN pc_components pc_case ON b.case_id = pc_case.id
      JOIN pc_components mb ON b.motherboard_id = mb.id
      WHERE b.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Build not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

async function validateComponents(cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id) {
  const ids = [cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id]
  const result = await pool.query(
    `SELECT id, type, brand, form_factor FROM pc_components WHERE id = ANY($1::int[])`,
    [ids]
  )

  const compMap = {}
  result.rows.forEach(c => { compMap[c.type] = c })

  if (compMap.cpu && compMap.motherboard) {
    if (compMap.cpu.brand !== compMap.motherboard.brand) {
      throw new Error(
        `Incompatible parts: ${compMap.cpu.brand.toUpperCase()} CPU cannot be paired with ${compMap.motherboard.brand.toUpperCase()} motherboard. CPU and motherboard must use the same socket platform.`
      )
    }
  }

  if (compMap.case && compMap.motherboard) {
    if (compMap.case.form_factor === 'matx' && compMap.motherboard.form_factor === 'atx') {
      throw new Error(
        `Incompatible parts: A Micro-ATX case cannot fit an ATX motherboard. Choose a larger case or a Micro-ATX motherboard.`
      )
    }
  }
}

export const createBuild = async (req, res) => {
  const { build_name, cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id } = req.body

  if (!build_name || !cpu_id || !gpu_id || !ram_id || !storage_id || !case_id || !motherboard_id) {
    return res.status(400).json({ error: 'All components must be selected.' })
  }

  try {
    await validateComponents(cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id)

    const priceResult = await pool.query(
      `SELECT SUM(price) as total FROM pc_components WHERE id = ANY($1::int[])`,
      [[cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id]]
    )
    const total_price = parseFloat(priceResult.rows[0].total)

    const result = await pool.query(
      `INSERT INTO pc_builds (build_name, cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [build_name, cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id, total_price]
    )

    res.status(201).json({ id: result.rows[0].id, message: 'Build created successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const updateBuild = async (req, res) => {
  const { id } = req.params
  const { build_name, cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id } = req.body

  if (!build_name || !cpu_id || !gpu_id || !ram_id || !storage_id || !case_id || !motherboard_id) {
    return res.status(400).json({ error: 'All components must be selected.' })
  }

  try {
    await validateComponents(cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id)

    const priceResult = await pool.query(
      `SELECT SUM(price) as total FROM pc_components WHERE id = ANY($1::int[])`,
      [[cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id]]
    )
    const total_price = parseFloat(priceResult.rows[0].total)

    const result = await pool.query(
      `UPDATE pc_builds
       SET build_name=$1, cpu_id=$2, gpu_id=$3, ram_id=$4, storage_id=$5, case_id=$6, motherboard_id=$7, total_price=$8
       WHERE id=$9 RETURNING *`,
      [build_name, cpu_id, gpu_id, ram_id, storage_id, case_id, motherboard_id, total_price, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Build not found' })
    }

    res.json({ message: 'Build updated successfully', id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteBuild = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM pc_builds WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Build not found' })
    }
    res.json({ message: 'Build deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
