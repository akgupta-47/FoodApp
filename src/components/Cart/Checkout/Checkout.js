import classes from "./Checkout.module.css";
import useInput from "../../../hooks/use-input";

const isEmpty = (value) => value.trim() === "";
const isFiveChars = (value) => value.trim().length !== 5;

const Checkout = (props) => {
    const {
        value: nameValue,
        isValid: nameIsValid,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: resetName,
    } = useInput(isEmpty);
    const {
        value: streetValue,
        isValid: streetIsValid,
        hasError: streetHasError,
        valueChangeHandler: streetChangeHandler,
        inputBlurHandler: streetBlurHandler,
        reset: resetStreet,
    } = useInput(isEmpty);
    const {
        value: cityValue,
        isValid: cityIsValid,
        hasError: cityHasError,
        valueChangeHandler: cityChangeHandler,
        inputBlurHandler: cityBlurHandler,
        reset: resetCity,
    } = useInput(isEmpty);
    const {
        value: postalValue,
        isValid: postalIsValid,
        hasError: postalHasError,
        valueChangeHandler: postalChangeHandler,
        inputBlurHandler: postalBlurHandler,
        reset: resetPostal,
    } = useInput(isFiveChars);

    let formIsValid = false;

    if (nameIsValid && streetIsValid && cityIsValid && postalIsValid) {
        formIsValid = true;
    }

    const confirmHandler = (event) => {
        event.preventDefault();

        if (!formIsValid) {
            return;
        }

        resetName();
        resetCity();
        resetStreet();
        resetPostal();

        props.onConfirm({
            name: nameValue,
            street: streetValue,
            postalCode: postalValue,
            city: cityValue,
        });
    };

    const nameControlClasses = `${classes.control} ${
        nameHasError ? classes.invalid : ""
    }`;
    const streetControlClasses = `${classes.control} ${
        streetHasError ? classes.invalid : ""
    }`;
    const postalCodeControlClasses = `${classes.control} ${
        postalHasError ? classes.invalid : ""
    }`;
    const cityControlClasses = `${classes.control} ${
        cityHasError ? classes.invalid : ""
    }`;

    return (
        <form className={classes.form} onSubmit={confirmHandler}>
            <div className={nameControlClasses}>
                <label htmlFor="name">Your Name</label>
                <input
                    type="text"
                    id="name"
                    value={nameValue}
                    onChange={nameChangeHandler}
                    onBlur={nameBlurHandler}
                />
                {nameHasError && (
                    <p className={classes["error-text"]}>
                        Please enter a first name.
                    </p>
                )}
            </div>
            <div className={streetControlClasses}>
                <label htmlFor="street">Street</label>
                <input
                    type="text"
                    id="street"
                    value={streetValue}
                    onChange={streetChangeHandler}
                    onBlur={streetBlurHandler}
                />
                {streetHasError && (
                    <p className={classes["error-text"]}>
                        Please enter a street.
                    </p>
                )}
            </div>
            <div className={postalCodeControlClasses}>
                <label htmlFor="postal">Postal Code</label>
                <input
                    type="text"
                    id="postal"
                    value={postalValue}
                    onChange={postalChangeHandler}
                    onBlur={postalBlurHandler}
                />
                {postalHasError && (
                    <p className={classes["error-text"]}>
                        Please enter your postal code.
                    </p>
                )}
            </div>
            <div className={cityControlClasses}>
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    id="city"
                    value={cityValue}
                    onChange={cityChangeHandler}
                    onBlur={cityBlurHandler}
                />
                {cityHasError && (
                    <p className={classes["error-text"]}>
                        Please enter your city.
                    </p>
                )}
            </div>
            <div className={classes.actions}>
                <button type="button" onClick={props.onCancel}>
                    Cancel
                </button>
                <button disabled={!formIsValid} className={classes.submit}>
                    Confirm
                </button>
            </div>
        </form>
    );
};

export default Checkout;
