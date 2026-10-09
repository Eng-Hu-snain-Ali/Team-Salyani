import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Plus,
  Edit2,
  Check,
  X,
  Power,
  Clock,
  Tag,
  AlertCircle,
  Zap,
  Droplets,
  Wind,
  Bike,
  Car,
  Hammer,
} from 'lucide-react';
import type { ServiceItem, ServiceCategoryType, PricingType } from '../../types';

export const AdminServiceManagementView: React.FC = () => {
  const {
    services,
    categories,
    updateServiceItem,
    addNewServiceItem,
    toggleServiceStatus,
    showToast,
  } = useApp();

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editPricingType, setEditPricingType] = useState<PricingType>('fixed');
  const [editName, setEditName] = useState<string>('');

  // Add Service Form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<ServiceCategoryType>('electrician');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState<number>(500);
  const [newPricingType, setNewPricingType] = useState<PricingType>('fixed');
  const [newMinutes, setNewMinutes] = useState<number>(45);

  const startEdit = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setEditPrice(srv.price);
    setEditPricingType(srv.pricingType);
    setEditName(srv.name);
  };

  const saveEdit = async (serviceId: string) => {
    await updateServiceItem(serviceId, {
      price: editPrice,
      pricingType: editPricingType,
      name: editName,
    });
    setEditingServiceId(null);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Service name is required', 'warning');
      return;
    }

    await addNewServiceItem({
      categoryId: newCategory,
      name: newName,
      description: newDesc || 'Standard doorstep repair service in Faisalabad.',
      price: newPrice,
      pricingType: newPricingType,
      estimatedMinutes: newMinutes,
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewDesc('');
  };

  const getCategoryIcon = (category: ServiceCategoryType) => {
    switch (category) {
      case 'electrician':
        return <Zap size={14} />;
      case 'plumber':
        return <Droplets size={14} />;
      case 'ac-technician':
        return <Wind size={14} />;
      case 'bike-mechanic':
        return <Bike size={14} />;
      case 'car-mechanic':
        return <Car size={14} />;
      case 'carpenter':
        return <Hammer size={14} />;
      default:
        return <Wrench size={14} />;
    }
  };

  return (
    <div className="admin-services-mgmt-container">
      {/* Header */}
      <div className="mgmt-header-box">
        <div>
          <h1 className="mgmt-title">Service Catalog & Rate Card Engine</h1>
          <p className="mgmt-sub">
            Configure Faisalabad service prices, toggle fixed vs diagnostic rates, and manage availability.
          </p>
        </div>
        <button
          className="add-service-btn-hero"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Categories Summary Cards */}
      <div className="categories-summary-bar">
        {categories.map((cat) => {
          const count = services.filter((s) => s.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="category-metric-pill">
              {getCategoryIcon(cat.id)}
              <strong>{cat.name}:</strong>
              <span>{count} services</span>
            </div>
          );
        })}
      </div>

      {/* Services Table */}
      <div className="mgmt-table-card">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Service Name & Description</th>
              <th>Pricing Type</th>
              <th>Standard Price</th>
              <th>Estimated Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((srv) => {
              const isEditing = editingServiceId === srv.id;

              return (
                <tr key={srv.id} className={!srv.isActive ? 'row-inactive' : ''}>
                  {/* Category */}
                  <td>
                    <span className="cat-pill-cell">
                      {getCategoryIcon(srv.categoryId)}
                      <span>{srv.categoryId.replace('-', ' ').toUpperCase()}</span>
                    </span>
                  </td>

                  {/* Name */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="inline-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <div>
                        <strong>{srv.name}</strong>
                        <p className="desc-sub">{srv.description}</p>
                      </div>
                    )}
                  </td>

                  {/* Pricing Type */}
                  <td>
                    {isEditing ? (
                      <select
                        className="inline-select"
                        value={editPricingType}
                        onChange={(e) => setEditPricingType(e.target.value as PricingType)}
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="estimated">Inspection Required</option>
                      </select>
                    ) : (
                      <span className={`pricing-type-pill ${srv.pricingType}`}>
                        {srv.pricingType === 'fixed' ? 'Fixed Price' : 'Inspection'}
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td>
                    {isEditing ? (
                      <div className="inline-price-input">
                        <span>Rs.</span>
                        <input
                          type="number"
                          className="inline-number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ) : (
                      <strong className="price-bold">Rs. {srv.price}</strong>
                    )}
                  </td>

                  {/* Estimated Time */}
                  <td>
                    <span className="time-sub">
                      <Clock size={12} /> ~{srv.estimatedMinutes} mins
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td>
                    <button
                      className={`status-toggle-btn ${srv.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleServiceStatus(srv.id)}
                      title={srv.isActive ? 'Click to disable' : 'Click to enable'}
                    >
                      <Power size={13} />
                      <span>{srv.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  {/* Edit Actions */}
                  <td>
                    {isEditing ? (
                      <div className="inline-action-btns">
                        <button
                          className="save-btn"
                          onClick={() => saveEdit(srv.id)}
                          title="Save changes"
                        >
                          <Check size={14} /> Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingServiceId(null)}
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="edit-icon-btn"
                        onClick={() => startEdit(srv)}
                        title="Edit rate & pricing"
                      >
                        <Edit2 size={15} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-surface add-service-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-row">
              <div>
                <span className="modal-step-tag">Catalog Engine</span>
                <h2>Add New Service to Rate Card</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="add-service-form">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategoryType)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Inverter AC PCB Card Repair"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="form-two-col">
                <div className="form-group">
                  <label className="form-label">Pricing Type</label>
                  <select
                    className="form-select"
                    value={newPricingType}
                    onChange={(e) => setNewPricingType(e.target.value as PricingType)}
                  >
                    <option value="fixed">Fixed Labor Price</option>
                    <option value="estimated">Inspection Required</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Standard Price (Rs.) *</label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    className="form-input"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Service Duration (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  step={15}
                  className="form-input"
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(parseInt(e.target.value) || 45)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe scope of labor and included diagnostic steps..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-btn-primary">
                  Publish Service to Customer App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
