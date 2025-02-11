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
      {items.map((item) => (
        <ShowItem 
          key={item.title} 
          item={item} 
          onUpdate={handleItemUpdate}
        />
      ))}
    </>
  );
}
