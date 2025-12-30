
import { createContext, useContext, ReactNode, FC, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types';

export interface CartItem {
    productId: string;
    quantity: number;
    notes?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useLocalStorage<CartItem[]>('tapeindia_cart_v1', []);

    // FIX: Wrapped in useCallback to prevent infinite loops in useEffects that depend on this function
    const addToCart = useCallback((productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item => 
                    item.productId === productId 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prev, { productId, quantity: 1 }];
        });
    }, [setCart]);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    }, [setCart]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => 
            item.productId === productId ? { ...item, quantity } : item
        ));
    }, [setCart]);

    const clearCart = useCallback(() => setCart([]), [setCart]);

    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
