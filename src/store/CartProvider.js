import { useReducer } from "react";

import CartContext from "./cart-context";

const defaultCartState = {
    items: [],
    totalAmount: 0,
};

const cartReducer = (state, action) => {
    if (action.type === "ADD") {
        // state is previous state and action contains all the values sent from dispatcher function
        const updatedTotalAmount =
            state.totalAmount + action.item.price * action.item.amount;

        // first we check if the item is already in the cart, so we don't add a duplicate of the item and just increment its count
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );
        // extract that particular cart item from the array of items
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItems;

        // if its already in array
        if (existingCartItem) {
            // create a new object with same properties and updated count
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount,
            };
            // bring the items array
            updatedItems = [...state.items];
            // replace the item at the index in items array with the new item object
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            // if the item has appeared for the first time in the array
            // concat returns a new array , its better than changing the previous array
            updatedItems = state.items.concat(action.item);
        }
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount,
        };
    }

    if (action.type === "REMOVE") {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id
        );
        const existingItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingItem.price;
        let updatedItems;
        if (existingItem.amount === 1) {
            updatedItems = state.items.filter((item) => item.id !== action.id);
        } else {
            const updatedItem = {
                ...existingItem,
                amount: existingItem.amount - 1,
            };
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount,
        };
    }
    if (action.type === "CLEAR") {
        return defaultCartState;
    }

    return defaultCartState;
};

const CartProvider = (props) => {
    const [cartState, dispatchCartAction] = useReducer(
        cartReducer,
        defaultCartState
    );

    const addItemToCartHandler = (item) => {
        dispatchCartAction({ type: "ADD", item: item });
    };

    const removeItemFromCartHandler = (id) => {
        dispatchCartAction({ type: "REMOVE", id: id });
    };

    const clearCartHandler = () => {
        dispatchCartAction({ type: "CLEAR" });
    };

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        clearCart: clearCartHandler,
    };

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartProvider;
