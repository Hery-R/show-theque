"use client";

import React, { useState, useEffect } from "react";
import ShowItem from "../components/show_item";
import TransitionItem from "../components/transition_item";
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
        { id: 1, name: "La nuit de l'été", quantity: 30 },
        { id: 2, name: "Le grand bleu", quantity: 30 },
        { id: 3, name: "La fête des masques", quantity: 30 },
    ]);

    const [transitions, setTransitions] = useState([
        { id: 1, quantity: 0.5 },
        { id: 2, quantity: 0.5 },
    ]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [ScenographyTotalDuration, setScenographyTotalDuration] = useState("1h40min 0s");
    const [SceneDuration, setSceneDuration] = useState("1h30min 0s");
    const [TransitionDuration, setTransitionDuration] = useState("1h0min 0s");

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleShowUpdate = (updatedItem: any) => {
        const updatedShows = shows.map(show =>
            show.id === updatedItem.id ? updatedItem : show
        );
        setShow(updatedShows);
        updateDurations(updatedShows, transitions);
    };

    const handleTransitionUpdate = (updatedTransition: any) => {
        const updatedTransitions = transitions.map(transition =>
            transition.id === updatedTransition.id ? updatedTransition : transition
        );
        setTransitions(updatedTransitions);
        updateDurations(shows, updatedTransitions);
    };

    const formatDuration = (totalSeconds: number) => {
        if (isNaN(totalSeconds)) return "";
        const heures = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return heures > 0 ? `${heures}h ${minutes}min ${seconds.toFixed(0)}s` : `${minutes}min ${seconds.toFixed(0)}s`;
    };

    const updateDurations = (currentShows: any[], currentTransitions: any[]) => {
        // Calcul de la durée totale des scènes en minutes
        const totalSceneDuration = currentShows.reduce((acc, show) => acc + show.quantity, 0);
        setSceneDuration(formatDuration(totalSceneDuration * 60));

        // Calcul de la durée totale des transitions en minutes
        const totalTransitionDuration = currentTransitions.reduce((acc, transition) => acc + transition.quantity, 0);
        setTransitionDuration(formatDuration(totalTransitionDuration * 60));

        // Calcul de la durée totale de la scénographie
        const totalDuration = totalSceneDuration + totalTransitionDuration;
        setScenographyTotalDuration(formatDuration(totalDuration * 60));
    };

    const updateShowsIds = (shows: any[]) => {
        return shows.map((show, index) => ({
            ...show,
            id: index + 1
        }));
    };

    const handleShowAdd = (id: number) => {
        const index = shows.findIndex(show => show.id === id);
        const newShows = [...shows];
        newShows.splice(index + 1, 0, { id: id + 1, name: "", quantity: 0 });
        // Mettre à jour tous les IDs après l'ajout
        const updatedShows = updateShowsIds(newShows);
        setShow(updatedShows);

        // ajoute une transition si nécessaire
        if (index < transitions.length) {
            const newTransitions = [...transitions];
            newTransitions.splice(index, 0, { id: index + 1, quantity: 0 });
            // Mettre à jour les IDs des transitions
            const updatedTransitions = newTransitions.map((transition, idx) => ({
                ...transition,
                id: idx + 1
            }));
            setTransitions(updatedTransitions);
        }
        updateDurations(updatedShows, transitions);
    };

    const handleShowDelete = (id: number) => {
        const index = shows.findIndex(show => show.id === id);
        const newShows = shows.filter(show => show.id !== id);
        // Mettre à jour tous les IDs après la suppression
        const updatedShows = updateShowsIds(newShows);
        setShow(updatedShows);

        // supprime la transition si nécessaire
        if (index < transitions.length) {
            const newTransitions = [...transitions];
            newTransitions.splice(index, 1);
            // Mettre à jour les IDs des transitions
            const updatedTransitions = newTransitions.map((transition, idx) => ({
                ...transition,
                id: idx + 1
            }));
            setTransitions(updatedTransitions);
            updateDurations(updatedShows, updatedTransitions);
        } else {
            updateDurations(updatedShows, transitions);
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setShow((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const reorderedItems = arrayMove(items, oldIndex, newIndex);
                // mettre à jour les id des éléments
                return updateShowsIds(reorderedItems);
            });

        }
    };

    // Save data to localStorage
    const saveData = () => {
        const data = {
            shows,
            transitions,
            scenographyTotalDuration: ScenographyTotalDuration,
            sceneDuration: SceneDuration,
            transitionDuration: TransitionDuration
        };
        localStorage.setItem('showThequeData', JSON.stringify(data));
    };

    // Load data from localStorage
    const loadData = () => {
        const savedData = localStorage.getItem('showThequeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            setShow(data.shows);
            setTransitions(data.transitions);
            setScenographyTotalDuration(data.scenographyTotalDuration);
            setSceneDuration(data.sceneDuration);
            setTransitionDuration(data.transitionDuration);
        }
    };

    // Clear all data
    const clearData = () => {
        setShow([{ id: 1, name: "La nuit de l'été", quantity: 0.5 }]);
        setTransitions([{ id: 1, quantity: 0 }]);
        setScenographyTotalDuration("360min 0s");
        setSceneDuration("360min 0s");
        setTransitionDuration("35min 0s");
        localStorage.removeItem('showThequeData');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl text-accent font-bold text-center">
                ShowThèque
            </h1>

            <div className="flex flex-row justify-center items-center mt-10 mb-10">
                <button
                    onClick={saveData}
                    className="text-xl bg-secondary text-card rounded-md p-2 mr-2"
                >
                    Save
                </button>
                <button
                    onClick={loadData}
                    className="text-xl bg-card text-secondary rounded-md p-2 mr-2 border-2"
                >
                    Load
                </button>
                <button
                    onClick={clearData}
                    className="text-xl bg-primary text-card rounded-md p-2"
                >
                    Clear
                </button>
            </div>

            <div className="flex flex-row items-center justify-between w-full max-w-2xl">
                <div className="w-12"></div>
                <h3 className="text-xl text-accent font-bold w-36">Order</h3>
                <h3 className="text-xl text-accent font-bold w-48">Shows</h3>
                <h3 className="text-xl text-accent font-bold w-36">Durations</h3>
                <div className="flex-1"></div>
            </div>


            {mounted ? (
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
                                    onAdd={handleShowAdd}
                                    onDelete={handleShowDelete}
                                />
                                {index < transitions.length && (
                                    <TransitionItem
                                        key={`transition-${show.id}`}
                                        item={{
                                            id: transitions[index].id,
                                            title: `${show.name} -> ${shows[index + 1].name}`,
                                            quantity: transitions[index].quantity
                                        }}
                                        onUpdate={handleTransitionUpdate}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </SortableContext>
                </DndContext>
            ) : null}
            <div className="flex flex-col items-center w-full">
                <h4 className="text-xl text-foreground ">Scenography total duration : {ScenographyTotalDuration}</h4>
                <h4 className="text-xl text-foreground ">Scene duration : {SceneDuration} </h4>
                <h4 className="text-xl text-foreground ">Transition duration : {TransitionDuration}</h4>
            </div>
        </div>
    );
}
