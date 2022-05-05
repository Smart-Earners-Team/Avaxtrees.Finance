import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Section from "../components/layouts/Section";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import cls from "classnames";
import Button from "../components/Buttons";
import { rePlantTrees, harvestCrops, plantTrees } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import CopyToClipboard from "../components/Tools/CopyToClipboard";
import { getTreeContract } from "../utils/contractHelpers";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "../utils/bigNumber";
import { RefreshContext } from "../contexts/RefreshContext";
import { PageProps } from "gatsby";
import { getFullDisplayBalance } from "../utils/formatBalance";
import { StaticImage } from "gatsby-plugin-image";
import SEO from "../components/SEO";
import CountdownTimer from "../components/Tools/CoundownTimer";

const IndexPage = (props: PageProps) => {
  const [amountToPay, setAmountToPay] = useState("");
  const [contractBal, setContractBal] = useState("0");
  const [treeBal, setTreeBal] = useState("0");
  const [rePlanting, setRePlanting] = useState(false);
  const [planting, setPlanting] = useState(false);
  const [avaxRewards, setAvaxRewards] = useState("0");
  const [harvesting, setHarvesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [daysOfReplant, setDaysOfReplant] = useState("0");

  const {
    wallet: { balance },
    triggerFetchTokens,
    refAddress,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { fast } = useContext(RefreshContext);

  // Get AVAX Balance in the contract
  useEffect(() => {
    (async () => {
      const contract = getTreeContract();
      try {
        const { _hex } = await contract.getBalance();
        const bal = new BigNumber(_hex).div(BIG_TEN.pow(18));
        setContractBal(bal.toFixed(4));
      } catch (err) {
        setContractBal("0");
      }
    })();
  }, [library, treeBal, balance, avaxRewards]);

  // Get User Trees and avax rewards
  useEffect(() => {
    (async () => {
      if (account && library) {
        const contract = getTreeContract(library.getSigner());
        try {
          // User tree bal
          const { _hex: myTrees } = await contract.getMyTrees(account);
          const trees = new BigNumber(myTrees).toJSON();
          // User rewards in avax
          const { _hex: cropForRewards } = await contract.getMyCrop(account);
          const { _hex: avaxRewards } = await contract.calculateCropSell(
            cropForRewards
          );
          const avax = getFullDisplayBalance(
            new BigNumber(avaxRewards).times(" 0.92"), // Percentage to recieve
            18,
            18
          );

          // Days of replant
          const { _hex: days } = await contract.getDaysOfRePlant(account);

          setTreeBal(trees);
          setAvaxRewards(avax);
          setDaysOfReplant(new BigNumber(days).toJSON());
        } catch (err) {
          console.error(err);
          setTreeBal("0");
          setAvaxRewards("0");
        }
      } else {
        setTreeBal("0");
        setAvaxRewards("0");
      }
    })();
  }, [account, library, contractBal, balance, fast, active]);

  const handleInputChange: React.FormEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        const val = e.currentTarget.value.replace(/,/g, ".");
        const pattern = /^[0-9]*[.,]?[0-9]{0,18}$/g;
        if (!pattern.test(val)) return;

        const amount = new BigNumber(val);
        const bal = new BigNumber(balance);
        if (amount.isGreaterThan(bal)) {
          setErrorMsg("Insufficient funds in your wallet");
        } else {
          setErrorMsg("");
        }
        setAmountToPay(val);
      },
      [balance]
    );

  const handleRePlant = useCallback(async () => {
    if (library) {
      setRePlanting(true);
      try {
        await rePlantTrees(refAddress, library.getSigner());
        toastSuccess("You have replanted.");
        triggerFetchTokens();
      } catch (err) {
        // console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setRePlanting(false);
      }
    }
  }, [library, refAddress]);

  const handlePlantTree = useCallback(async () => {
    if (library) {
      setPlanting(true);
      try {
        await plantTrees(amountToPay, refAddress, library.getSigner());
        toastSuccess("Success", "You have planted some trees.");
        triggerFetchTokens();
        setAmountToPay("");
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setPlanting(false);
      }
    }
  }, [library, amountToPay, refAddress]);

  const handleHarvest = useCallback(async () => {
    if (library) {
      setHarvesting(true);
      try {
        await harvestCrops(library.getSigner());
        toastSuccess("Success", "You have harvested");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setHarvesting(false);
      }
    }
  }, [library, amountToPay]);

  const {
    location: { origin },
  } = props; // Page props

  return (
    <main className="min-h-screen w-full">
      <SEO
        description="Plant a tree with a minimum of 0.1 AVAX, earn 8% daily returns. This
          is a complete ecosystem."
      />
      <Section noPadding={false}>
        <div className="body-text mx-auto">
          <h1>Plant a Tree</h1>
          <p>
            Plant a tree with a minimum of 0.1 AVAX, earn 8% daily returns. This
            is a complete ecosystem.
          </p>
          <p>
            Chickens eat eat rice($SOYA) and drop $FERT which in turn helps
            $TREE's to grow. For every 10,000 $TREE token sold, we plant a tree
            in Africa.
          </p>
          <p>
            To stake Tree token and start earning $FERT, check out the staking
            page.
          </p>
          <div className="!mt-10 space-y-3 text-base text-gray-100">
            <h2 className="text-white">Now There is a Rule!</h2>
            <p>
              # To maintain a green ecosystem, you should re-plant trees at
              least 6 days days and harvest your earned crop every 7th day. This
              means after you plant a tree (deposit) You should not harvest
              until you have replanted for 6 days
            </p>
            <p>
              # Any withdrawal done when the compounding days is less than 6
              would be taxed 60% which will remain in the ecosystem.
            </p>
            <p>
              # After every harvest, there is a 6-day cool down time period.
            </p>
            <p>PS:- Please read the Tree Paper for more information.</p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-center my-10 md:space-x-10">
          <div className="w-full max-w-sm">
            <div className="rounded-lg py-2 px-4 bg-white">
              <div className="font-light text-center">
                <div className="mb-2">
                  Remaining time from your last harvest
                </div>
                <CountdownTimer />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <MetricChip
                label="Contract Balance"
                value={contractBal}
                symbol="AVAX"
                icon={
                  <StaticImage
                    alt=""
                    src="../images/avax-crypto-logo.png"
                    width={10}
                    height={10}
                    placeholder="blurred"
                  />
                }
              />
              <MetricChip
                label="Your Compounding Count"
                value={daysOfReplant}
                symbol="Trxs"
                borderColorClassName="border-[#57BEEB]"
                icon={
                  <StaticImage
                    alt=""
                    src="../images/growth-graph.png"
                    width={10}
                    height={10}
                    placeholder="blurred"
                  />
                }
              />
            </div>
          </div>
          <div className="w-full max-w-md mb-3">
            {active ? (
              <Fragment>
                <div
                  className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0
                  md:space-x-3 mb-5"
                >
                  <MetricChip
                    label="Your Planted Trees"
                    value={treeBal}
                    symbol="Trees"
                    borderColorClassName="border-[#B8D525]"
                    icon={
                      <StaticImage
                        alt=""
                        src="../images/coconut-tree-clip-art-coconut-tree-vector-png-removebg-preview.png"
                        width={10}
                        height={10}
                        placeholder="blurred"
                      />
                    }
                  />
                  <MetricChip
                    label="Pending Rewards"
                    value={avaxRewards}
                    symbol="AVAX"
                    borderColorClassName="border-[#E8C341]"
                    icon={
                      <StaticImage
                        alt=""
                        src="../images/avax-crypto-logo.png"
                        width={10}
                        height={10}
                        placeholder="blurred"
                      />
                    }
                  />
                </div>
                <div
                  className="bg-[#132803]/90 md:bg-transparent p-3 md:p-0 rounded-xl
                  md:rounded-none"
                >
                  <TextInput
                    errorMsg={errorMsg}
                    onChangeHandler={handleInputChange}
                    value={amountToPay}
                    onSubmit={handlePlantTree}
                    trx={planting}
                    isDisabled={
                      planting ||
                      errorMsg.length > 0 ||
                      Number.isNaN(Number.parseFloat(amountToPay))
                    }
                  />
                  <div className="p-3">
                    <div className="space-x-3 flex justify-center items-center my-3">
                      <Button
                        onClick={handleRePlant}
                        disabled={
                          rePlanting ||
                          !active ||
                          Number.parseFloat(avaxRewards) === 0
                        }
                        loading={rePlanting}
                      >
                        Re Plant
                      </Button>
                      <Button
                        onClick={handleHarvest}
                        disabled={
                          harvesting ||
                          !active ||
                          Number.parseFloat(avaxRewards) === 0
                        }
                        loading={harvesting}
                      >
                        Harvest
                      </Button>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="p-3 text-center flex flex-col items-center space-y-3 rounded-lg bg-white">
                <p>You will need to connect your wallet first</p>
                <ConnectWalletButton />
              </div>
            )}
          </div>
        </div>
        <div className="body-text">
          <div className="my-5 max-w-xl mx-auto lg:mx-0">
            <h2>Nutritional Facts</h2>
            <NutritionalStat
              label="Daily Return"
              value="8"
              symbol="%"
              divider
            />
            <NutritionalStat label="APR" value="2920" symbol="%" divider />
            <NutritionalStat label="Dev Fee" value="3" symbol="%" divider />
          </div>
          <h2>Referral Link</h2>
          <p>
            Earn 12% of the AVAX used to plant tree from anyone who uses your
            referral link
          </p>
          <CopyToClipboard
            title="Your Referral Link"
            content={
              account == null
                ? "Connect your wallet to see your referral address"
                : `${origin}/?ref=${account}`
            }
            canCopy={account != null}
          />
        </div>
      </Section>
    </main>
  );
};

interface MetricChipProps {
  label: string;
  value: string;
  symbol: string;
  borderColorClassName?: string;
  icon: React.ReactNode;
}

const MetricChip = ({
  label,
  value,
  symbol,
  borderColorClassName,
  icon,
}: MetricChipProps) => {
  return (
    <div className="bg-white py-2 px-3 space-y-1 rounded-lg text-base inline-block w-full">
      <div className="flex items-center text-xs space-x-1">
        {icon}
        <span>{symbol}</span>
      </div>
      <div
        className={cls("border-l-4 pl-3", borderColorClassName, {
          "border-red-500": !borderColorClassName,
        })}
      >
        <div className="font-medium">{label}</div>
        <div className="font-medium text-gray-500">{value}</div>
      </div>
    </div>
  );
};

interface NutritionalStatProps {
  label: string;
  value: string;
  symbol: string;
  divider?: boolean;
}

const NutritionalStat = (props: NutritionalStatProps) => {
  return (
    <div
      className={cls("flex flex-col text-base space-y-0.5 my-3", {
        "!flex-row items-center space-x-2 !my-1": props.divider,
      })}
    >
      <div className="text-[#575757] dark:text-[#E2E2E4]">{props.label}</div>
      {props.divider && <div className="h-[1px] w-1/3 sm:w-20 bg-[#A2A5AB]" />}
      <div
        className={cls("text-[#575757] dark:text-[#E2E2E4]", {
          "text-xl font-medium text-[#5b6a81] !-mt-0.5": !props.divider,
        })}
      >
        {props.value}{" "}
        <span className="font-light !text-lg">{props.symbol}</span>
      </div>
    </div>
  );
};

interface TextInputProps {
  errorMsg: string;
  onChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
  isDisabled: boolean;
  trx: boolean; // transaction
}

const TextInput = ({
  onChangeHandler,
  onSubmit,
  errorMsg,
  value,
  isDisabled,
  trx,
}: TextInputProps) => {
  const hasError = errorMsg.length > 0;
  const {
    wallet: { balance },
  } = useAppContext();
  return (
    <div className="w-full space-y-2 mx-auto">
      <div className="bg-white p-3 rounded-lg transition-transform duration-200 ease-linear">
        <div>
          <div className="mb-2 text-xs font-light">Deposit Amount</div>
          <div className="relative flex items-center justify-between space-x-1">
            <div className=" w-full">
              <input
                type="text"
                className={cls(
                  "placeholder-gray-400 outline-none border-b border-[#7B8BA5] font-bold",
                  "transition-all duration-200 text-[#7B8BA5] p-1 disabled:opacity-70 text-xl",
                  "disabled:cursor-not-allowed block bg-transparent w-full leading-none",
                  {
                    "text-red-400": hasError,
                  }
                )}
                placeholder="0"
                value={value}
                onChange={onChangeHandler}
              />
              <div
                className={cls(
                  "flex justify-between text-opacity-80 py-0.5 px-1 text-sm",
                  {
                    "text-red-400 font-normal": hasError,
                  }
                )}
              >
                <span>Balance</span>
                <span>{hasError ? errorMsg : balance}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-base">
              <StaticImage
                src="../images/avax-crypto-logo.png"
                alt=""
                width={30}
                height={30}
                placeholder="blurred"
              />{" "}
              <span>AVAX</span>
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        className="block mx-auto w-full"
        disabled={isDisabled}
        loading={trx}
      >
        Plant A Tree
      </Button>
    </div>
  );
};
export default IndexPage;
