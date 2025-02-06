import { Product } from "@/types";
import ProductCard from "./product-card";

const ProductList = ({data, title, limit}: {data: Product[], limit?:number, title?: string}) => {
    
    const limitedData =  data.slice(0, limit ?? data.length);
    
    return (  
        <div className="my-10">
            <h2 className="h2-bold mb-4">
                {title}
            </h2>
             {
                data.length > 0 ? (
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {limitedData.map((product: Product) => (
                            <ProductCard key={product.slug} product={product} />
                        ))}
                    </div>
                ) : (
                    <div>
                        <p>Products not found</p>
                    </div>
                )
             }
        </div>
    );
}
 
export default ProductList;