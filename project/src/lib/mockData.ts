export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type LostItem = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Books' | 'ID Cards' | 'Clothing' | 'Others';
  lost_date: string;
  location: string;
  contact_info: string;
  image_url: string | null;
  status: 'lost' | 'found' | 'closed';
  created_at: string;
  updated_at: string;
};

export type FoundItem = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Books' | 'ID Cards' | 'Clothing' | 'Others';
  found_date: string;
  location: string;
  contact_info: string;
  image_url: string | null;
  status: 'available' | 'returned' | 'closed';
  created_at: string;
  updated_at: string;
};

// Mock data service
class MockDataService {
  private lostItems: LostItem[] = [];
  private foundItems: FoundItem[] = [];

  constructor() {
    // Load data from localStorage
    const savedLostItems = localStorage.getItem('lostItems');
    const savedFoundItems = localStorage.getItem('foundItems');

    if (savedLostItems) {
      this.lostItems = JSON.parse(savedLostItems);
    }

    if (savedFoundItems) {
      this.foundItems = JSON.parse(savedFoundItems);
    }
  }

  private saveData() {
    localStorage.setItem('lostItems', JSON.stringify(this.lostItems));
    localStorage.setItem('foundItems', JSON.stringify(this.foundItems));
  }

  async getLostItems(limit?: number) {
    const items = [...this.lostItems].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return limit ? items.slice(0, limit) : items;
  }

  async getFoundItems(limit?: number) {
    const items = [...this.foundItems].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return limit ? items.slice(0, limit) : items;
  }

  async addLostItem(item: Omit<LostItem, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: LostItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };

    this.lostItems.push(newItem);
    this.saveData();
    return newItem;
  }

  async addFoundItem(item: Omit<FoundItem, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: FoundItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    };

    this.foundItems.push(newItem);
    this.saveData();
    return newItem;
  }

  async updateLostItem(id: string, updates: Partial<LostItem>) {
    const index = this.lostItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');

    const now = new Date().toISOString();
    this.lostItems[index] = {
      ...this.lostItems[index],
      ...updates,
      updated_at: now,
    };

    this.saveData();
    return this.lostItems[index];
  }

  async updateFoundItem(id: string, updates: Partial<FoundItem>) {
    const index = this.foundItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');

    const now = new Date().toISOString();
    this.foundItems[index] = {
      ...this.foundItems[index],
      ...updates,
      updated_at: now,
    };

    this.saveData();
    return this.foundItems[index];
  }

  async getLostItem(id: string) {
    const item = this.lostItems.find(item => item.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }

  async getFoundItem(id: string) {
    const item = this.foundItems.find(item => item.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }

  async searchItems(query: string) {
    const lowercaseQuery = query.toLowerCase();
    const matchItem = (item: LostItem | FoundItem) =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      item.location.toLowerCase().includes(lowercaseQuery);

    const matchedLost = this.lostItems.filter(matchItem);
    const matchedFound = this.foundItems.filter(matchItem);

    return {
      lost: matchedLost,
      found: matchedFound,
    };
  }

  async getStats() {
    return {
      totalLost: this.lostItems.length,
      totalFound: this.foundItems.length,
      totalReturned: this.foundItems.filter(item => item.status === 'returned').length,
    };
  }
}

export const mockDataService = new MockDataService();