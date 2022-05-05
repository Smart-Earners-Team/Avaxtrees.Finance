import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import Button from "../components/Buttons";
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
        <div
          className="body-text mt-10 flex flex-col md:justify-between md:flex-row md:items-center
            md:space-x-10 p-5 md:p-10"
        >
          <div className="flex w-full items-center justify-between p-5 md:p-10">
            <div className="float-left inline-block w-1/3">
              <StaticImage
                alt="$tree and $fart vector png"
                src="../images/coconut-tree-and-fart-clip-vector.png"
                placeholder="blurred"
                layout="fullWidth"
              />
            </div>
            <div className="space-y-3 w-2/3">
              <p className="text-right">
                $FART Earned <br /> 0.00
              </p>
              <p className="text-right">
                APR <br /> 281%
              </p>
              <p className="text-right">
                Liquidity <br /> $0.00
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col space-y-10 md:items-start">
            <Button disabled>Harvest</Button>
            <div className="border border-green-500 p-3 w-full flex flex-col max-w-xs space-y-3">
              <div className="text-base">START FARMING</div>
              <Button className="block w-full">COMING SOON</Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
