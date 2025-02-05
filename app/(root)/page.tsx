import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metadata = {
  title: 'Home'
}
import { Button } from "@/components/ui/button";

const Home = async () => {
  const latestProducts = await getLatestProducts()

  return <>
  <ProductList data={latestProducts} limit={4} title="Newest Arrivals">

  </ProductList>
  </>
}
 
export default Home;