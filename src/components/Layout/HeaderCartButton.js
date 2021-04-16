import { useContext, useState, useEffect } from "react";
import CartContext from "../../store/cart-context";
import classes from "./HeaderCartButton.module.css";
import CartIcon from "../Cart/CartIcon";

const HeaderCartButton = (props) => {
    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
    const cartCtx = useContext(CartContext);

    const { items } = cartCtx;

    const numberOfCartItems = items.reduce((curNumber, item) => {
        return curNumber + item.amount;
    }, 0);

    const btnClasses = `${classes.button} ${
        btnIsHighlighted ? classes.bump : ""
    }`;

    useEffect(() => {
        if (items.length === 0) {
            return;
        }
        setBtnIsHighlighted(true);

        // we added the removal of bump, as it only bumped once , as the bump was caused by addition of class
        // and the first bump added the class, so to bump again we need to add the class that means remove the class first
        const timer = setTimeout(() => {
            setBtnIsHighlighted(false);
        }, 300);

        // its better to clear your timers
        return () => {
            clearTimeout(timer);
        };
    }, [items]);

    return (
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span>Your Cart</span>
            <span className={classes.badge}>{numberOfCartItems}</span>
        </button>
    );
};

export default HeaderCartButton;
