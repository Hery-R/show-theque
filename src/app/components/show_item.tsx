"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ShowItem({item, onUpdate, onAdd, onDelete}: Readonly<{
  item: any,
  onUpdate: (updatedItem: any) => void,
  onAdd: (id: number) => void,
  onDelete: (id: number) => void
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...item, name: e.target.value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...item, quantity: e.target.value === '' ? 0 : parseFloat(e.target.value)});
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-row justify-center items-center bg-background p-4 mb-4 rounded-lg shadow-md w-full max-w-2xl"
    >
      <div
        className="flex items-center mr-4 text-primary cursor-move"
        {...listeners}
      >
        ⠿
      </div>
      <p className="text-2xl font-bold">{`Show ${item.id}`}</p>
      <input  
        type="text" 
        value={item.name} 
        onChange={handleNameChange}
        className="border-2 border-primary border-opacity-50 rounded-md ml-2 text-xl text-primary"
      />
      <input 
        type="number" 
        value={item.quantity === 0 ? "" : item.quantity || ''} 
        onChange={handleQuantityChange}
        step="0.1"
        className="border-2 border-foreground border-opacity-50 rounded-md ml-2 text-xl text-foreground"
      />
      <button 
        className="btn-lg ml-2 text-xl text-primary hover:text-accent"
        onClick={() => onAdd(item.id)}
      >
        +
      </button>
      <button 
        className="btn-lg ml-2 text-xl text-primary hover:text-accent" 
        onClick={() => onDelete(item.id)}
      >
        -
      </button>
    </div>
  );
}