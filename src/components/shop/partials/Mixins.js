const getCart = () => {
  try {
    const carts = JSON.parse(localStorage.getItem("cart")) || [];
    return Array.isArray(carts) ? carts : [];
  } catch (error) {
    return [];
  }
};

export const subTotal = (id, price) => {
  let subTotalCost = 0;
  getCart().forEach((item) => {
    if (item.id === id) subTotalCost = item.quantitiy * price;
  });
  return subTotalCost;
};

export const quantity = (id) => {
  let product = 0;
  getCart().forEach((item) => {
    if (item.id === id) product = item.quantitiy;
  });
  return product;
};

export const totalCost = () => {
  let totalCost = 0;
  getCart().forEach((item) => {
    totalCost += item.quantitiy * item.price;
  });
  return totalCost;
};
