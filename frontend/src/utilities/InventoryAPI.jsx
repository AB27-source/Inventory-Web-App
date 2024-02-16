import Axios from './Axios';

export const updateInventoryItem = async (itemId, itemData) => {
  try {
    const response = await Axios.put(`/inventory/items/${itemId}/`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error updating inventory item:", error.response || error);
    throw error;
  }
};

export const deleteInventoryItem = async (itemId) => {
  try {
    await Axios.delete(`/inventory/items/${itemId}/`);
    return itemId;
  } catch (error) {
    console.error("Error deleting inventory item:", error.response || error);
    throw error;
  }
};

export default{
  updateInventoryItem,
  deleteInventoryItem
};
