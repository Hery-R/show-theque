"use client";

import React from "react";
import ShowItem from "../components/show_item";
import TransitionItem from "../components/transition_item";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function ShowList() {
    const [shows, setShow] = useState([
        { id: 1, name: "The Lion King", quantity: 30 },
        { id: 2, name: "Pirates of the Caribbean", quantity: 20 },
        { id: 3, name: "The Hunger Games", quantity: 10 },
    ]);

    const [transitions, setTransitions] = useState([
        { id: 1, quantity: 0 },
        { id: 2, quantity: 0 },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

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

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setShow((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
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

            <div className="flex flex-col items-center h-screen">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={shows.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
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
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
