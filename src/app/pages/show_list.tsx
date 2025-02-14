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
        { id: 1, quantity: 10 },
        { id: 2, quantity: 10 },
    ]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [ScenographyTotalDuration, setScenographyTotalDuration] = useState("1h50min 0s");
    const [SceneDuration, setSceneDuration] = useState("1h30min 0s");
    const [TransitionDuration, setTransitionDuration] = useState("20min 0s");

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

        const totalSecondsRounded = Math.round(totalSeconds);
        let heures = Math.floor(totalSecondsRounded / 3600);
        let minutes = Math.floor((totalSecondsRounded % 3600) / 60);
        let seconds = totalSecondsRounded % 60;
        
        // l'heure doit être comprise entre 0 et 24
        heures = heures >= 24 ? heures % 24 : heures;

        // les minutes doivent être comprises entre 0 et 60
        if (minutes >= 60) {
            heures = (heures + Math.floor(minutes / 60)) % 24;
            minutes = minutes % 60;
        }
        
        return heures > 0 ? `${heures}h ${minutes}min ${seconds}s` : `${minutes}min ${seconds}s`;
    };

    const updateDurations = (currentShows: any[], currentTransitions: any[]) => {
        // Calcul de la durée totale des scènes (en minutes)
        const totalSceneDuration = currentShows.reduce((acc, show) => acc + (isNaN(show.quantity) ? 0 : parseFloat(show.quantity)), 0);
        setSceneDuration(formatDuration(totalSceneDuration * 60));

        // Calcul de la durée totale des transitions (en minutes)
        const totalTransitionDuration = currentTransitions.reduce((acc, transition) => acc + (isNaN(transition.quantity) ? 0 : parseFloat(transition.quantity)), 0);
        setTransitionDuration(formatDuration(totalTransitionDuration * 60));

        // Calcul de la durée totale de la scénographie (en minutes)
        const totalDuration = totalSceneDuration * 60 + totalTransitionDuration * 60;
        setScenographyTotalDuration(formatDuration(totalDuration));
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

    // stoker les données
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

    // Load les données depuis localStorage
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

    // Clear toutes les données
    const clearData = () => {
        setShow([{ id: 1, name: "La nuit de l'été", quantity: 5 }]);
        setTransitions([{ id: 1, quantity: 0 }]);
        setScenographyTotalDuration("5min 0s");
        setSceneDuration("5min 0s");
        setTransitionDuration("0min 0s");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl text-accent font-bold text-center">
                ShowThèque
            </h1>

            <div className="flex flex-row justify-center items-center mt-10 mb-10">
                <button
                    onClick={saveData}
                    className="text-xl bg-secondary text-card rounded-md p-2 mr-2 w-12 h-12 flex items-center justify-center"
                    title="Save"
                >
                    <i className="fas fa-save"></i>
                </button>
                <button
                    onClick={loadData}
                    className="text-xl bg-card text-secondary rounded-md p-2 mr-2 border-2 w-12 h-12 flex items-center justify-center"
                    title="Load"
                >
                    <i className="fas fa-folder-open"></i>
                </button>
                <button
                    onClick={clearData}
                    className="text-xl bg-primary text-card rounded-md p-2 w-12 h-12 flex items-center justify-center"
                    title="Clear"
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>

            <div className="flex flex-row items-center justify-between w-full max-w-2xl">
                <div className="w-12"></div>
                <h3 className="text-xl text-foreground font-bold w-36">Order</h3>
                <h3 className="text-xl text-chart-5 font-bold w-48">Shows</h3>
                <h3 className="text-xl text-foreground font-bold w-36">Durations</h3>
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
                                {index < shows.length - 1 && (
                                    <TransitionItem
                                        key={`transition-${show.id}`}
                                        item={{
                                            id: transitions[index].id,
                                            title: `${show.name} → ${shows[index + 1].name}`,
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
