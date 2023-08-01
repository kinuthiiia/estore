import { RefinementList, Hits } from "react-instantsearch-hooks-web";
import CustomRefinementList from "../components/refinementlist";

export default function Test() {
  return (
    <div className="p-4">
      <RefinementList attribute="category" />
      <Hits />

      <CustomRefinementList
        attribute="category"
        sortBy={["count:desc", "name:asc"]}
      />
    </div>
  );
}
