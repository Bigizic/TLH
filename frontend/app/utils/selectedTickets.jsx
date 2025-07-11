export const saveSelectedTicketsToStorage = (selectedTickets) => {
  localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
};

export const getSelectedTicketsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('selectedTickets')) || [];
  } catch {
    return [];
  }
};
