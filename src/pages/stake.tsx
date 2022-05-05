import React from "react";
import Section from "../components/layouts/Section";
import SEO from "../components/SEO";

export default function StakingPage() {
  return (
    <main className="min-h-screen w-full">
      <SEO
        title="Stake $TREE, earn $FERT from Roosters at a juicy APR."
        description="Stake $TREE, earn $FERT from Roosters at a juicy APR. $TREE's need $FERTilizer to grow. $FERT is available and trading in
        the markets"
      />
      <Section noPadding={false}>
        <div className="body-text space-y-5">
          <h1>Stake $TREE, earn $FERT from Roosters at a juicy APR.</h1>
          <p>
            $TREE's need $FERTilizer to grow. $FERT is available and trading in
            the markets
          </p>
        </div>
      </Section>
    </main>
  );
}
