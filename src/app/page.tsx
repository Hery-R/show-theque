"use client";

import ShowItem from "./components/show_item";
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([
    { title: "Show 1", name: "The Que", quantity: 30 },
    { title: "Show 2", name: "Peter Pan", quantity: 30 },
    { title: "Show 3", name: "The Lion King", quantity: 30 },
  ]);

  const handleItemUpdate = (updatedItem: any) => {
    setItems(items.map(item =>
      item.title === updatedItem.title ? updatedItem : item
    ));
  };

  return (
    <>
      <h1 className="text-3xl text-accent font-bold text-center mt-10">
        ShowThèque
      </h1>

      <div className="flex flex-col items-center justify-center h-screen">
        {items.map((item) => (
          <ShowItem
            key={item.title}
            item={item}
            onUpdate={handleItemUpdate}
          />
        ))}
        <div className="flex flex-row justify-center items-center">
          <button className="text-xl bg-secondary text-card rounded-md p-2 mr-2">Save</button>
          <button className="text-xl bg-card text-secondary rounded-md p-2 mr-2 border-2">Load</button>
          <button className="text-xl bg-primary text-card rounded-md p-2">Clear</button>
        </div>

      </div>

    </>
  );
}
