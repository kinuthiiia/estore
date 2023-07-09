import { useContext } from "react";
import { Footer, Logoheader, ProductCard } from "../components";

import { Userdatacontext } from "../context/userdata";

export default function Saved() {
  const { data } = useContext(Userdatacontext);

  return (
    <div>
      <Logoheader />

      <div className="p-4 space-y-8">
        <h1 className="font-medium text-[1.5rem]">Saved products</h1>
        <span className="block text-[#909090] mb-3">
          {data?.saved.length} items
        </span>
        <div className="grid grid-cols-2 gap-8">
          {data?.saved.map((el, i) => (
            <ProductCard key={i} hit={el} />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
}
