import React from "react";
import Section from "../components/layouts/Section";

export default function StakingPage() {
  return (
    <main className="min-h-screen w-full">
      <Section noPadding={false}>
        <div className="body-text">
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
