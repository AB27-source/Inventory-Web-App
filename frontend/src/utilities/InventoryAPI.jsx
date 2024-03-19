import Axios from './Axios';

export const updateInventoryItem = async (itemId, itemData, accessToken) => {
  try {
    const response = await Axios.put(`/inventory/items/${itemId}/`, itemData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating inventory item:", error.response || error);
    throw error;
  }
};

export const deleteInventoryItem = async (itemId, accessToken) => {
  try {
    await Axios.delete(`/inventory/items/${itemId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return itemId;
  } catch (error) {
    console.error("Error deleting inventory item:", error.response || error);
    throw error;
  }
};

export default {
  updateInventoryItem,
  deleteInventoryItem
};
