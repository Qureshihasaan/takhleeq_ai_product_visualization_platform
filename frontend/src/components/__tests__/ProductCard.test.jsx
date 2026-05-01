import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ui/ProductCard';

describe('ProductCard', () => {
  const defaultProps = {
    image: '/test-image.png',
    title: 'Test Product',
    tags: ['Cotton', 'Premium'],
    description: 'A great product for testing.',
    price: 29.99,
    onAddToCart: vi.fn(),
  };

  it('renders the product title', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeTruthy();
  });

  it('renders the price', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('$29.99')).toBeTruthy();
  });

  it('renders all tags', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Cotton')).toBeTruthy();
    expect(screen.getByText('Premium')).toBeTruthy();
  });

  it('renders the description', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('A great product for testing.')).toBeTruthy();
  });

  it('renders the product image with correct src', () => {
    render(<ProductCard {...defaultProps} />);
    const img = screen.getByAltText('Test Product');
    expect(img.getAttribute('src')).toBe('/test-image.png');
  });

  it('calls onAddToCart when the Buy Now button is clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /add test product to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it('renders with empty tags array without crashing', () => {
    render(<ProductCard {...defaultProps} tags={[]} />);
    expect(screen.getByText('Test Product')).toBeTruthy();
  });
});
