import { on } from "events";

export default function TransitionItem({ item, onUpdate }: Readonly<{
    item: {
        id: number,
        title: string,
        quantity: number
    },
    onUpdate: (updatedItem: any) => void
}>) {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onUpdate({ ...item, quantity: value === '' ? 0 : parseFloat(value)});
    };

    return (
        <div className="flex flex-row justify-center items-center my-2 p-2 bg-secondary/20 rounded-md w-96">
            <p className="text-lg text-secondary">{item.title}</p>
            <input 
                type="number" 
                value={item.quantity === 0 ? "" : item.quantity || ''} 
                onChange={handleQuantityChange}
                step="0.1"
                className="w-20 border-2 border-secondary border-opacity-50 rounded-md ml-2 text-lg text-secondary"
            />
        </div>
    );
}