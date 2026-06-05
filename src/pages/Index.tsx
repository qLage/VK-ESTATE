import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Catalog } from "@/components/sections/Catalog";
import { Gallery } from "@/components/sections/Gallery";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Reviews } from "@/components/sections/Reviews";
import { CTA } from "@/components/sections/CTA";

interface IndexProps {
  onOpenForm: () => void;
}

export default function Index({ onOpenForm }: IndexProps) {
  return (
    <>
      <Hero />
      <Stats />
      <Catalog limit={9} />
      <Gallery />
      <Services onOpenForm={onOpenForm} />
      <Team limit={8} />
      <Reviews />
      <CTA onOpenForm={onOpenForm} />
    </>
  );
}
