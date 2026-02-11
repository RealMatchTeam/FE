import ReSuggestContent from "./resuggest-content";
import { useHideHeader } from "../../../hooks/useHideHeader";

export default function ReSuggest() {
    useHideHeader(true);
    return <ReSuggestContent />;
}
