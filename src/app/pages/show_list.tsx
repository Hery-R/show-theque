"use client";

import React from "react";
import ShowItem from "../components/show_item";
import TransitionItem from "../components/transition_item";
import { useState } from "react";


export default function ShowList() {
    const [shows, setShow] = useState([
        { id: 1, title: "Show 1", name: "The Lion King", quantity: 30 },
        { id: 2, title: "Show 2", name: "Pirates of the Caribbean", quantity: 20 },
        { id: 3, title: "Show 3", name: "The Hunger Games", quantity: 10 },
    ]);

    const [transitions, setTransitions] = useState([
        { id: 1, quantity: 0 },
        { id: 2, quantity: 0 },
    ]);

    const handleShowUpdate = (updatedItem: any) => {
        setShow(shows.map(show =>
            show.id === updatedItem.id ? updatedItem : show
        ));
    };

    const handleTransitionUpdate = (updatedTransition: any) => {
        setTransitions(transitions.map(transition =>
            transition.id === updatedTransition.id ? updatedTransition : transition
        ));
    };



    return (
        <>
            <h1 className="text-3xl text-accent font-bold  text-center mt-10 mb-10">
                ShowThèque
            </h1>

            <div className="flex flex-row justify-center items-center mt-10 mb-10">
                <button className="text-xl bg-secondary text-card rounded-md p-2 mr-2">Save</button>
                <button className="text-xl bg-card text-secondary rounded-md p-2 mr-2 border-2">Load</button>
                <button className="text-xl bg-primary text-card rounded-md p-2">Clear</button>
            </div>

            <div className="flex flex-col items-center   h-screen">
                {shows.map((show, index) => (
                    <React.Fragment key={`show-group-${show.id}`}>
                        <ShowItem
                            key={show.id}
                            item={show}
                            onUpdate={handleShowUpdate}
                        />
                        {index < shows.length - 1 && (
                            <TransitionItem
                                key={`transition-${show.id}`}
                                item={{
                                    id: show.id,
                                    title: `${show.name} -> ${shows[index + 1].name}`,
                                    quantity: transitions[index]?.quantity || 0
                                }}
                                onUpdate={handleTransitionUpdate}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

        </>
    );
}
