import { useNavigate } from "react-router";
import Button from "../../../components/common/Button";
import NewSuggestIcon from "../../../assets/icon/new-suggest.svg";
import ExistSuggestIcon from "../../../assets/icon/exist-suggest.svg";

export default function MatchingSuggestContent() {
  const navigate = useNavigate();

  const handleNewCampaign = () => {
    navigate("/matching/suggest/create?type=new");
  };

  const handleExistingCampaign = () => {
    navigate("/matching/suggest/create?type=existing");
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center px-5 py-20 gap-17">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="text-title1"
        onClick={handleNewCampaign}
      >
        <img src={NewSuggestIcon} alt="" className="w-6 h-6 mr-2" />
        신규 캠페인 제안
      </Button>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="text-title1"
        onClick={handleExistingCampaign}
      >
        <img src={ExistSuggestIcon} alt="" className="w-6 h-6 mr-2 brightness-0 invert" />
        기존 캠페인 제안
      </Button>
    </div>
  );
}
