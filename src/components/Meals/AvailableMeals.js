import { useEffect, useState } from "react";
import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card/Card";
import MealItem from "./MealItem/MealItem";
import Spinner from "../UI/Spinner/Spinner";

const AvailableMeals = () => {
    const [meals, setmeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    // we didn't make the function inside useEffect async
    useEffect(() => {
        const fetchResponse = async () => {
            const response = await fetch(
                "https://movieresthttp-default-rtdb.firebaseio.com/meals.json"
            );

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseData = await response.json();

            const loadedMeals = [];
            for (const key in responseData) {
                loadedMeals.push({
                    id: key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price,
                });
            }
            setmeals(loadedMeals);
            setIsLoading(false);
        };

        // as fetchResponse returned a promise, in case of error it neede to be handeled
        // and we didn't handle it inside try-catch as fetchResponse is async and in order to do anything after getting the response from it
        // we would hav required to await the fetchResponse call, which inturn would have made the function inside useEffect return promise
        // and useEffect can only return a cleanup function
        fetchResponse().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, []);

    const mealsList = meals.map((meal) => (
        <MealItem
            key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    ));
    return (
        <section className={classes.meals}>
            {httpError && (
                <Card>
                    <p className={classes.mealsError}>{httpError}</p>
                </Card>
            )}
            {isLoading && !httpError && (
                <Card>
                    <p className={classes.mealsLoading}>Loading.....</p>
                    <Spinner />
                </Card>
            )}
            {!isLoading && !httpError && (
                <Card>
                    <ul>{mealsList}</ul>
                </Card>
            )}
        </section>
    );
};

export default AvailableMeals;
