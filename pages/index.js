import Head from 'next/head';
import { useState } from 'react';

import Carousel from '~/components/Carousel';
import { Promo } from '~/components/Promo';
import Slider from '~/components/Slider';
import { getData } from '~/utils';

function Home(props) {
  const [newestProducts,setNewestProducts] = useState(props.newestProducts)
  const [bestSellProducts,setBestSellProducts] = useState(props.bestSellProducts)

  return (
    <div className="home_page">
      <Head>
        <title>Home page</title>
      </Head>

      <Carousel autoPlay={3}/>
      <Promo/>
      <Slider title="Best seller" products={bestSellProducts} />
      <Slider title="New products" products={newestProducts} />
      
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || 'all';
  const sort = query.sort || '';
  const search = query.search || 'all';

  const resNewestProducts = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&sort=${sort}&title=${search}`,
  );

  const resBestSellProducts = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&sort="-sold"&title=${search}`,
  ); 

  return {
    props: {
      newestProducts: resNewestProducts.products,
      bestSellProducts: resBestSellProducts.products,
    }, // will be passed to the page component as props
  };
}

export default Home;
