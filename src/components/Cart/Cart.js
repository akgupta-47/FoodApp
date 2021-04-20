import { useContext, useState } from "react";

import classes from "./Cart.module.css";
import Modal from "../UI/Modal/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout/Checkout";

const Cart = (props) => {
    const cartCtx = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 });
    };

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(
                "https://movieresthttp-default-rtdb.firebaseio.com/orders",
                {
                    method: "POST",
                    body: JSON.stringify({
                        user: userData,
                        orderedItems: cartCtx.items,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Problem in sending order...");
            }

            setIsSubmitting(false);
            setDidSubmit(true);
        } catch (error) {
            setError(error.message);
            setIsSubmitting(false);
        }
        cartCtx.clearCart();
    };

    const cartItems = (
        <ul className={classes["cart-items"]}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            ))}
        </ul>
    );

    const modalActions = (
        <div className={classes.actions}>
            <button
                className={classes["button--alt"]}
                onClick={props.onHideCart}
            >
                Close
            </button>
            {hasItems && (
                <button className={classes.button} onClick={orderHandler}>
                    Order
                </button>
            )}
        </div>
    );

    const cartModalContent = (
        <>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && (
                <Checkout
                    onConfirm={submitOrderHandler}
                    onCancel={props.onHideCart}
                />
            )}
            {!isCheckout && modalActions}
        </>
    );

    const isSubmittingModalHandler = (
        <>
            <p>Sending over Data....</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onHideCart}>
                    Close
                </button>
            </div>
        </>
    );

    const didSubmitModalHandler = (
        <>
            <p>Successfully ordered....</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onHideCart}>
                    Close
                </button>
            </div>
        </>
    );

    const errorSubmittingOrder = (
        <>
            <p>{error}</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onHideCart}>
                    Close
                </button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onHideCart}>
            {!isSubmitting && !didSubmit && !error && cartModalContent}
            {isSubmitting && !error && isSubmittingModalHandler}
            {!isSubmitting && didSubmit && !error && didSubmitModalHandler}
            {error && errorSubmittingOrder}
        </Modal>
    );
};

export default Cart;
