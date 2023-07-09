import { RefinementList, Hits } from "react-instantsearch-hooks-web";

export default function Test() {
  return (
    <div className="p-4">
      <RefinementList attribute="category" />
      <Hits />
    </div>
  );
}
