import { useSearchParams } from "next/navigation";

const handleQueryParams = () => {
  const searchParams = useSearchParams();
  const chain = searchParams.get("chain");

  return chain;
};

export default handleQueryParams;
