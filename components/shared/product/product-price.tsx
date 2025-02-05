import { cn } from "@/lib/utils";

const ProductPrice = ({value, className}: {value: number, className?: string}) => {
    const stringValue = value.toFixed(2);
    const [initValue, floatValue] = stringValue.split('.')
    return (  
        <p className={cn('text-2xl', className)}>
            <span className="text-xs align-upper">$</span>
            {initValue}
            <span className="text-xs align-upper">.{floatValue}</span>
        </p>
    );
}
 
export default ProductPrice;