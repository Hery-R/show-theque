export default function TransitionItem({ item, onUpdate }: Readonly<{
    item: {
        id: number,
        title: string,
        quantity: number
    },
    onUpdate: (updatedItem: any) => void
}>) {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value) || 0;
        onUpdate({ 
            id: item.id,
            quantity: newQuantity
        });
    };

    return (
        <div className="flex flex-row justify-center items-center my-2 p-2 bg-secondary/20 rounded-md w-96">
            <p className="text-lg text-secondary">{item.title}</p>
            <input 
                type="number" 
                value={item.quantity} 
                onChange={handleQuantityChange}
                min="0"
                className="ml-2 w-16 text-center bg-card text-secondary rounded-md p-1"
            />
        </div>
    );
}