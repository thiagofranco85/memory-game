import { IconProps } from "@phosphor-icons/react";

type CardWeight = "thin" | "light" | "regular" | "bold" | "duotone" | "fill"; 

interface CardProps {
    id:string;
    IconType: React.ComponentType<IconProps>;
    size:number;
    weight:CardWeight;
    color:string;
}

export function Card({id, IconType, size, weight, color}:CardProps){
    return (
        <div className="card">
            <IconType key={id} size={size} weight={weight} color={color} />
        </div>
    )

}