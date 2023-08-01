import {
  InstantSearch,
  Stats,
  useInfiniteHits,
} from "react-instantsearch-hooks-web";
import { Footer, Logoheader, ProductCard } from "../../components";

import { useRouter } from "next/router";
import { searchClient } from "../_app";

export default function Saved() {
  const router = useRouter();

  const {
    query: { category },
  } = router;

  const {
    hits,
    currentPageHits,
    results,
    isFirstPage,
    isLastPage,
    showPrevious,
    showMore,
    sendEvent,
  } = useInfiniteHits();

  return (
    <div>
      <Logoheader />

      <div className="p-4 space-y-8">
        <InstantSearch
          searchClient={searchClient}
          indexName="thrifthub"
          initialUiState={{
            indexName: {
              query: "thrifthub",
              refinementList: {
                colors: [category],
              },
            },
          }}
        >
          <ProductList category={category} />
        </InstantSearch>
        <Footer />
      </div>
    </div>
  );
}

const ProductList = ({ category }) => {
  const {
    hits,
    currentPageHits,
    results,
    isFirstPage,
    isLastPage,
    showPrevious,
    showMore,
    sendEvent,
  } = useInfiniteHits();

  return (
    <>
      <h1 className="font-medium text-[1.5rem]">{category}</h1>
      <span className="block text-[#909090] mb-3">
        <Stats />
      </span>
      <div className="grid grid-cols-2 gap-8">
        {currentPageHits.map((_hit, i) => (
          <ProductCard key={i} hit={_hit} />
        ))}
      </div>
    </>
  );
};
