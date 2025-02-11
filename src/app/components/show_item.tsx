"use client";

export default function ShowItem({item, onUpdate}: Readonly<{
  item: any,
  onUpdate: (updatedItem: any) => void
}>) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...item, name: e.target.value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...item, quantity: parseInt(e.target.value)});
  };

  return (
    <>
      <div className="flex flex-row justify-center items-center">
        <p className="text-2xl font-bold">{item.title}</p>
        <input 
          type="text" 
          value={item.name} 
          onChange={handleNameChange}
          className="ml-2 text-xl"
        />
        <input 
          type="number" 
          value={item.quantity} 
          onChange={handleQuantityChange}
          min="0"
          className="ml-2 text-xl"
        />
        <button className="ml-2 text-xl">+</button>
        <button className="ml-2 text-xl">-</button>
        <button className="ml-2 text-xl">✔</button>
      </div>
    </>
  );
}