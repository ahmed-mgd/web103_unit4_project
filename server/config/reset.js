import { pool } from './database.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

async function createTables() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS pc_builds CASCADE;
      DROP TABLE IF EXISTS pc_components CASCADE;

      CREATE TABLE pc_components (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        brand VARCHAR(100),
        form_factor VARCHAR(50),
        specs JSONB
      );

      CREATE TABLE pc_builds (
        id SERIAL PRIMARY KEY,
        build_name VARCHAR(255) NOT NULL,
        cpu_id INTEGER REFERENCES pc_components(id),
        gpu_id INTEGER REFERENCES pc_components(id),
        ram_id INTEGER REFERENCES pc_components(id),
        storage_id INTEGER REFERENCES pc_components(id),
        case_id INTEGER REFERENCES pc_components(id),
        motherboard_id INTEGER REFERENCES pc_components(id),
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('Tables created successfully')

    await pool.query(`
      INSERT INTO pc_components (type, name, price, brand, specs) VALUES
      ('cpu', 'Intel Core i5-13600K', 279.99, 'intel', '{"cores": 14, "threads": 20, "base_clock": "3.5 GHz", "boost_clock": "5.1 GHz", "tdp": "125W", "socket": "LGA1700"}'),
      ('cpu', 'Intel Core i7-13700K', 409.99, 'intel', '{"cores": 16, "threads": 24, "base_clock": "3.4 GHz", "boost_clock": "5.4 GHz", "tdp": "125W", "socket": "LGA1700"}'),
      ('cpu', 'Intel Core i9-13900K', 589.99, 'intel', '{"cores": 24, "threads": 32, "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "tdp": "253W", "socket": "LGA1700"}'),
      ('cpu', 'AMD Ryzen 5 7600X', 249.99, 'amd', '{"cores": 6, "threads": 12, "base_clock": "4.7 GHz", "boost_clock": "5.3 GHz", "tdp": "105W", "socket": "AM5"}'),
      ('cpu', 'AMD Ryzen 7 7700X', 349.99, 'amd', '{"cores": 8, "threads": 16, "base_clock": "4.5 GHz", "boost_clock": "5.4 GHz", "tdp": "105W", "socket": "AM5"}'),
      ('cpu', 'AMD Ryzen 9 7950X', 699.99, 'amd', '{"cores": 16, "threads": 32, "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz", "tdp": "170W", "socket": "AM5"}')
    `)

    await pool.query(`
      INSERT INTO pc_components (type, name, price, brand, specs) VALUES
      ('gpu', 'NVIDIA GeForce RTX 3060', 349.99, 'nvidia', '{"vram": "12GB GDDR6", "boost_clock": "1.78 GHz", "tdp": "170W", "cuda_cores": 3584}'),
      ('gpu', 'NVIDIA GeForce RTX 3080', 699.99, 'nvidia', '{"vram": "10GB GDDR6X", "boost_clock": "1.71 GHz", "tdp": "320W", "cuda_cores": 8704}'),
      ('gpu', 'NVIDIA GeForce RTX 4090', 1599.99, 'nvidia', '{"vram": "24GB GDDR6X", "boost_clock": "2.52 GHz", "tdp": "450W", "cuda_cores": 16384}'),
      ('gpu', 'AMD Radeon RX 6700 XT', 329.99, 'amd', '{"vram": "12GB GDDR6", "boost_clock": "2.58 GHz", "tdp": "230W", "compute_units": 40}'),
      ('gpu', 'AMD Radeon RX 7900 XTX', 899.99, 'amd', '{"vram": "24GB GDDR6", "boost_clock": "2.50 GHz", "tdp": "355W", "compute_units": 96}')
    `)

    await pool.query(`
      INSERT INTO pc_components (type, name, price, specs) VALUES
      ('ram', '8GB DDR5-4800', 39.99, '{"capacity": "8GB", "type": "DDR5", "speed": "4800 MHz", "latency": "CL40", "sticks": 1}'),
      ('ram', '16GB DDR5-5200 (2x8GB)', 79.99, '{"capacity": "16GB", "type": "DDR5", "speed": "5200 MHz", "latency": "CL38", "sticks": 2}'),
      ('ram', '32GB DDR5-6000 (2x16GB)', 149.99, '{"capacity": "32GB", "type": "DDR5", "speed": "6000 MHz", "latency": "CL36", "sticks": 2}'),
      ('ram', '64GB DDR5-6400 (2x32GB)', 279.99, '{"capacity": "64GB", "type": "DDR5", "speed": "6400 MHz", "latency": "CL32", "sticks": 2}')
    `)

    await pool.query(`
      INSERT INTO pc_components (type, name, price, specs) VALUES
      ('storage', '500GB NVMe SSD (Gen 3)', 59.99, '{"capacity": "500GB", "interface": "PCIe 3.0 NVMe M.2", "read": "3,500 MB/s", "write": "2,500 MB/s"}'),
      ('storage', '1TB NVMe SSD (Gen 4)', 99.99, '{"capacity": "1TB", "interface": "PCIe 4.0 NVMe M.2", "read": "7,000 MB/s", "write": "6,500 MB/s"}'),
      ('storage', '2TB NVMe SSD (Gen 4)', 179.99, '{"capacity": "2TB", "interface": "PCIe 4.0 NVMe M.2", "read": "7,100 MB/s", "write": "6,800 MB/s"}'),
      ('storage', '4TB NVMe SSD (Gen 4)', 319.99, '{"capacity": "4TB", "interface": "PCIe 4.0 NVMe M.2", "read": "7,200 MB/s", "write": "6,900 MB/s"}')
    `)

    await pool.query(`
      INSERT INTO pc_components (type, name, price, brand, form_factor, specs) VALUES
      ('motherboard', 'ASUS ROG Strix Z790-E ATX', 449.99, 'intel', 'atx', '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "ATX", "ram_slots": 4, "m2_slots": 5, "pcie_x16": 2}'),
      ('motherboard', 'MSI MAG Z790 Tomahawk mATX', 249.99, 'intel', 'matx', '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "Micro-ATX", "ram_slots": 4, "m2_slots": 3, "pcie_x16": 1}'),
      ('motherboard', 'ASUS ROG Crosshair X670E ATX', 499.99, 'amd', 'atx', '{"socket": "AM5", "chipset": "X670E", "form_factor": "ATX", "ram_slots": 4, "m2_slots": 5, "pcie_x16": 2}'),
      ('motherboard', 'MSI MAG X670E Tomahawk mATX', 299.99, 'amd', 'matx', '{"socket": "AM5", "chipset": "X670E", "form_factor": "Micro-ATX", "ram_slots": 4, "m2_slots": 3, "pcie_x16": 1}')
    `)

    await pool.query(`
      INSERT INTO pc_components (type, name, price, form_factor, specs) VALUES
      ('case', 'Compact Micro Tower', 79.99, 'matx', '{"max_form_factor": "Micro-ATX", "size": "compact", "window": false, "rgb": false, "drive_bays": 2}'),
      ('case', 'Fractal Design Meshify 2', 109.99, 'atx', '{"max_form_factor": "ATX", "size": "mid", "window": true, "rgb": false, "drive_bays": 4}'),
      ('case', 'Lian Li PC-O11D XL', 179.99, 'atx', '{"max_form_factor": "E-ATX", "size": "full", "window": true, "rgb": false, "drive_bays": 6}'),
      ('case', 'Corsair iCUE 5000T RGB', 249.99, 'atx', '{"max_form_factor": "ATX", "size": "mid", "window": true, "rgb": true, "drive_bays": 4}')
    `)

    console.log('Seed data inserted successfully')
  } catch (err) {
    console.error('Error setting up database:', err)
  } finally {
    await pool.end()
  }
}

createTables()
