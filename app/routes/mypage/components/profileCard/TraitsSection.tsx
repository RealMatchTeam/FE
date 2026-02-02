import { useState } from "react";
import Section from "./CommonSection";
import TraitCard from "./TraitCard";
import TraitModal from "./TraitModal";
import { TRAITS } from "./traitData"; 
export default function TraitsSection() {
  const [selectedTrait, setSelectedTrait] = useState<typeof TRAITS[0] | null>(null);

  return (
    <>
      <Section
        title="내 특성"
        right={
          <button type="button" className="text-[20px] text-black/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#9B9BA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      >
        <div className="overflow-x-auto snap-x snap-mandatory">
          <div className="flex px-2 py-2 gap-2">
            {TRAITS.map((trait) => (
              <div key={trait.id} className="min-w-[136px] shrink-0 snap-start">
                <TraitCard trait={trait} onClick={() => setSelectedTrait(trait)} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {selectedTrait && (
        <TraitModal trait={selectedTrait} onClose={() => setSelectedTrait(null)} />
      )}
    </>
  );
}