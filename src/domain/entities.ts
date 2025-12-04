// Domain Layer - Core Business Logic
export interface CategoryId {
  value: string;
}

export interface CategoryName {
  value: string;
}

export interface Category {
  id: CategoryId;
  name: CategoryName;
}

export interface SubCategoryId {
  value: string;
}

export interface SubCategoryName {
  value: string;
}

export interface SubCategory {
  id: SubCategoryId;
  categoryId: CategoryId;
  name: SubCategoryName;
}

// Domain Events
export interface DomainEvent {
  type: string;
  timestamp: Date;
  aggregateId: string;
}

export interface CategorySelectedEvent extends DomainEvent {
  type: 'CategorySelected';
  categoryId: string;
}

export interface SubCategorySelectedEvent extends DomainEvent {
  type: 'SubCategorySelected';
  subCategoryId: string;
  categoryId: string;
}

// Value Objects
export class CategoryIdVO {
  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('Category ID cannot be empty');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: CategoryIdVO): boolean {
    return this._value === other._value;
  }
}

export class CategoryNameVO {
  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
    if (_value.length > 100) {
      throw new Error('Category name too long');
    }
  }

  get value(): string {
    return this._value;
  }
}

// Entity
export class CategoryEntity {
  private readonly _id: CategoryIdVO;
  private readonly _name: CategoryNameVO;
  private _events: DomainEvent[] = [];

  constructor(id: CategoryIdVO, name: CategoryNameVO) {
    this._id = id;
    this._name = name;
  }

  get id(): CategoryIdVO {
    return this._id;
  }

  get name(): CategoryNameVO {
    return this._name;
  }

  get events(): DomainEvent[] {
    return [...this._events];
  }

  clearEvents(): void {
    this._events = [];
  }

  select(): CategorySelectedEvent {
    const event: CategorySelectedEvent = {
      type: 'CategorySelected',
      timestamp: new Date(),
      aggregateId: this._id.value,
      categoryId: this._id.value
    };
    
    this._events.push(event);
    return event;
  }
}