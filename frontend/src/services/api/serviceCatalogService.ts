import type { ServiceCategory, ServiceItem, ServiceCategoryType, PricingType } from '../../types';
import { SERVICE_CATEGORIES, INITIAL_SERVICES } from '../../constants';

const SERVICES_KEY = 'ustad_online_services_v1';

class ServiceCatalogService {
  private getStoredServices(): ServiceItem[] {
    try {
      const stored = localStorage.getItem(SERVICES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    this.saveServices(INITIAL_SERVICES);
    return INITIAL_SERVICES;
  }

  private saveServices(services: ServiceItem[]): void {
    try {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    } catch {
      // Storage error
    }
  }

  public async getCategories(): Promise<ServiceCategory[]> {
    return SERVICE_CATEGORIES;
  }

  public async getServices(categoryId?: ServiceCategoryType): Promise<ServiceItem[]> {
    const list = this.getStoredServices();
    if (categoryId) {
      return list.filter((s) => s.categoryId === categoryId);
    }
    return list;
  }

  public async getServiceById(serviceId: string): Promise<ServiceItem | null> {
    const list = this.getStoredServices();
    return list.find((s) => s.id === serviceId) || null;
  }

  public async addService(payload: {
    categoryId: ServiceCategoryType;
    name: string;
    description: string;
    price: number;
    pricingType: PricingType;
    estimatedMinutes?: number;
    possibleExtraCharges?: string[];
  }): Promise<ServiceItem> {
    const list = this.getStoredServices();
    const newService: ServiceItem = {
      id: `srv-${payload.categoryId.slice(0, 4)}-${Date.now().toString().slice(-4)}`,
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      pricingType: payload.pricingType,
      isActive: true,
      estimatedMinutes: payload.estimatedMinutes || 45,
      possibleExtraCharges: payload.possibleExtraCharges || [],
    };

    list.push(newService);
    this.saveServices(list);
    return newService;
  }

  public async updateService(
    serviceId: string,
    updates: Partial<ServiceItem>
  ): Promise<ServiceItem | null> {
    const list = this.getStoredServices();
    const index = list.findIndex((s) => s.id === serviceId);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    this.saveServices(list);
    return list[index];
  }

  public async toggleServiceStatus(serviceId: string): Promise<ServiceItem | null> {
    const list = this.getStoredServices();
    const index = list.findIndex((s) => s.id === serviceId);
    if (index === -1) return null;

    list[index].isActive = !list[index].isActive;
    this.saveServices(list);
    return list[index];
  }
}

export const serviceCatalogService = new ServiceCatalogService();
