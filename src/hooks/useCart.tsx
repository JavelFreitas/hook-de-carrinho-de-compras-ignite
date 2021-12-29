import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      if(!cart) return;

      let updatedObject: Product = {} as Product;
      let productIdObject = cart.find(product => product.id === productId)

      if(productIdObject === undefined){
        const {data} = await api.get(`/products/${productId}`)
        updatedObject = {...data, amount: 1}
        setCart([...cart, updatedObject]) 
      }else{
        const {data} = await api.get<Stock>(`/stock/${productId}`);
        const errorCondition = productIdObject.amount + 1 > data.amount;

        if(errorCondition) throw new Error('Quantidade solicitada fora de estoque');
        cart.forEach(product => {if(product.id === productId){
          product.amount += 1;
        }})
        
        setCart([...cart]) 
      }

    } catch(e: any) {
      toast.error(e.message || 'Erro na adição do produto'); 
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
