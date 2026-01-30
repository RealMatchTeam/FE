import { useSearchParams } from "react-router";
import BrandContent from "./brand-content";

export default function BrandRoute() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  return <BrandContent key={type} />;
}
