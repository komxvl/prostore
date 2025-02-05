import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";

export const metadata = {
  title: 'Home'
}
import { Button } from "@/components/ui/button";

const Home = () => {
  return <>
  <ProductList data={sampleData.products} limit={4} title="Newest Arrivals">

  </ProductList>
  </>
}
 
export default Home;