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
import { reCookRice, eatRice, cookRice } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import CopyToClipboard from "../components/Tools/CopyToClipboard";
import { getRiceContract } from "../utils/contractHelpers";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "../utils/bigNumber";
import { RefreshContext } from "../contexts/RefreshContext";
import { PageProps } from "gatsby";
import { getFullDisplayBalance } from "../utils/formatBalance";
import { StaticImage } from "gatsby-plugin-image";
import SEO from "../components/SEO";

const IndexPage = (props: PageProps) => {
  const [amountToPay, setAmountToPay] = useState("");
  const [contractBal, setContractBal] = useState("0");
  const [riceBal, setRiceBal] = useState("0");
  const [reCooking, setReCooking] = useState(false);
  const [cooking, setCooking] = useState(false);
  const [avaxRewards, setAvaxRewards] = useState("0");
  const [eating, setEating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      const contract = getRiceContract();
      try {
        const { _hex } = await contract.getBalance();
        const bal = new BigNumber(_hex).div(BIG_TEN.pow(18));
        setContractBal(bal.toJSON());
      } catch (err) {
        setContractBal("0");
      }
    })();
  }, [library, riceBal, balance, avaxRewards]);

  // Get User Rice and avax rewards
  useEffect(() => {
    (async () => {
      if (account && library) {
        const contract = getRiceContract(library.getSigner());
        try {
          // User rice bal
          const { _hex: myRice } = await contract.getMyMiners(account);
          const rice = new BigNumber(myRice).toJSON(); // How many decimals?
          // User rwards in avax
          const { _hex: riceForRewards } = await contract.getMyRice(account);
          const { _hex: avaxRewards } = await contract.calculateRiceSell(
            riceForRewards
          );
          const avax = getFullDisplayBalance(
            new BigNumber(avaxRewards),
            18,
            18
          );

          setRiceBal(rice);
          setAvaxRewards(avax);
        } catch (err) {
          console.error(err);
          setRiceBal("0");
          setAvaxRewards("0");
        }
      } else {
        setRiceBal("0");
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
        // const bal = Number.parseFloat("100");

        if (amount.isGreaterThan(bal)) {
          setErrorMsg("Insufficient funds in your wallet");
        } else {
          setErrorMsg("");
        }
        setAmountToPay(val);
      },
      [balance]
    );

  const handleReCookRice = useCallback(async () => {
    if (library) {
      setReCooking(true);
      try {
        await reCookRice(refAddress, library.getSigner());
        toastSuccess("Success", "Your Rice has been re-cooked");
        triggerFetchTokens();
      } catch (err) {
        // console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setReCooking(false);
      }
    }
  }, [library, refAddress]);

  const handleCookRice = useCallback(async () => {
    if (library) {
      setCooking(true);
      try {
        await cookRice(amountToPay, refAddress, library.getSigner());
        toastSuccess(
          "Success",
          "Your Rice is cooking now, sit back and relax."
        );
        triggerFetchTokens();
        setAmountToPay("");
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setCooking(false);
      }
    }
  }, [library, amountToPay, refAddress]);

  const handleEatRice = useCallback(async () => {
    if (library) {
      setEating(true);
      try {
        await eatRice(library.getSigner());
        toastSuccess("Success", "Enjoying your rice? Smile.");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setEating(false);
      }
    }
  }, [library, amountToPay]);

  // Can start video
  /* const canStart = useCallback(
    () => Number.parseFloat(riceBal) > 0,
    [riceBal, account, active, library]
  ); */

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
        <div className="flex flex-col-reverse md:flex-row justify-between my-10 md:space-x-3">
          <div className="w-full">
            <div className="rounded-xl p-10 bg-white"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <MetricChip
                label="Contract Balance"
                value={contractBal}
                symbol="Rice"
              />
              <MetricChip
                label="Your Compounding Count"
                value={avaxRewards}
                symbol="Trxs"
                borderColorClassName="border-[#57BEEB]"
              />
            </div>
          </div>
          <div className="w-full mb-5">
            {active ? (
              <Fragment>
                <div
                  className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0
                  md:space-x-3 mb-10"
                >
                  <MetricChip
                    label="Your Planted Trees"
                    value={riceBal}
                    symbol="Trees"
                    borderColorClassName="border-[#B8D525]"
                  />
                  <MetricChip
                    label="Pending Rewards"
                    value={avaxRewards}
                    symbol="AVAX"
                    borderColorClassName="border-[#E8C341]"
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
                    onSubmit={handleCookRice}
                    trx={cooking}
                    isDisabled={
                      cooking ||
                      errorMsg.length > 0 ||
                      Number.isNaN(Number.parseFloat(amountToPay))
                    }
                  />
                  <div className="p-3">
                    <div className="space-x-3 flex justify-center items-center my-3">
                      <Button
                        onClick={handleReCookRice}
                        disabled={reCooking || !active}
                        loading={reCooking}
                      >
                        Re Plant
                      </Button>
                      <Button
                        onClick={handleEatRice}
                        disabled={eating || !active}
                        loading={eating}
                      >
                        Harvest
                      </Button>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="p-3 text-center flex flex-col items-center space-y-3 rounded-xl bg-white">
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
}

const MetricChip = ({
  label,
  value,
  symbol,
  borderColorClassName,
}: MetricChipProps) => {
  return (
    <div className="bg-white py-2 px-3 space-y-1 rounded-xl text-base inline-block w-full">
      <div className="flex items-center text-xs space-x-1">
        <StaticImage
          alt=""
          src="../images/icon.png"
          width={10}
          height={10}
          placeholder="blurred"
        />
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
      <div className="bg-white p-3 rounded-xl transition-transform duration-200 ease-linear">
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
                src="../images/icon.png"
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
