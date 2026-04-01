export const calculateTotal = (selected) => {
  return Object.values(selected)
    .filter(Boolean)
    .reduce((total, component) => total + parseFloat(component.price || 0), 0)
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price)
}
