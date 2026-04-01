export const validateBuild = (selected) => {
  const errors = []
  const { cpu, motherboard, case: pcCase, gpu, ram, storage } = selected

  if (!cpu) errors.push('Please select a CPU')
  if (!motherboard) errors.push('Please select a Motherboard')
  if (!gpu) errors.push('Please select a GPU')
  if (!ram) errors.push('Please select RAM')
  if (!storage) errors.push('Please select Storage')
  if (!pcCase) errors.push('Please select a Case')

  if (errors.length > 0) return errors

  if (cpu && motherboard && cpu.brand !== motherboard.brand) {
    errors.push(
      `Incompatible: ${cpu.brand.toUpperCase()} CPU cannot be paired with ${motherboard.brand.toUpperCase()} motherboard. CPU and motherboard must share the same socket platform.`
    )
  }

  if (pcCase && motherboard && pcCase.form_factor === 'matx' && motherboard.form_factor === 'atx') {
    errors.push(
      `Incompatible: The Compact Micro Tower cannot fit an ATX motherboard. Choose a larger case or a Micro-ATX motherboard.`
    )
  }

  return errors
}
