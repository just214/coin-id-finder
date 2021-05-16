import { InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import useDebounce from "../hooks/useDebounce";
import { FaCheck } from "react-icons/fa";
import { isMatch } from "../utils";

type SearchResult = {
  name: string;
  symbol: string;
  coinMarketCapId: string;
  coinGeckoId: string;
};

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const debouncedInput = useDebounce<string>(searchTerm, 500);

  useEffect(() => {
    setSearchResults(() =>
      debouncedInput.length < 3
        ? []
        : props.data.filter(
            (d) =>
              d.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
              d.symbol.toLowerCase().includes(debouncedInput.toLowerCase())
          )
    );
  }, [debouncedInput]);

  // If the input is cleared, we want to clear the search result immediately
  // instead of waiting for the debounce
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <Layout>
      <header className="my-8 mx-2">
        <h1 className="text-4xl lg:text-5xl font-bold flex items-center my-2 text-blue-500">
          <img
            className="fill-current h-10 w-10 lg:(w-12 h-12) mr-2"
            src="coin-id-finder-logo.svg"
          />
          Coin ID Finder
        </h1>
        <p className="text-sm">
          A handy little tool to find CoinMarketCap and CoinGecko coin ids for
          working with their respective APIs.
        </p>
      </header>

      <label className="mt-6">
        <input
          value={searchTerm}
          autoFocus={true}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search by coin name or symbol (ex. ETH or bitcoin)"
          className="rounded-full w-full py-4 px-4 outline-none bg-gray-100 dark:bg-gray-800 text-lg"
        />
      </label>

      <section className="mt-4">
        {debouncedInput.length > 0 && debouncedInput.length < 3 && (
          <div>Please enter at least 3 characters to search.</div>
        )}
        {!searchResults.length && debouncedInput.length > 3 && (
          <div>
            No results found for{" "}
            <span className="text-blue-500">{searchTerm}</span>.
          </div>
        )}
        <ul className={` ${searchResults.length ? "visible" : "hidden"}`}>
          {searchResults.map(
            ({ name, symbol, coinGeckoId, coinMarketCapId }) => {
              const isExactMatch =
                isMatch(name, debouncedInput) ||
                isMatch(symbol, debouncedInput);

              return (
                <li
                  key={name}
                  className={`p-2 flex items-center justify-between ${
                    isExactMatch
                      ? "rounded-xl bg:gray-100 dark:bg-gray-800"
                      : "bottom-border"
                  }`}
                >
                  <div>
                    <p className="font-bold">
                      {name}{" "}
                      <small className="text-gray-500 pl-1">{symbol}</small>
                    </p>

                    <p>
                      <span className="text-sm text-gray-500">
                        CoinGecko ID:
                      </span>{" "}
                      <b className="text-yellow-500">{coinGeckoId || "🤷🏻‍♂️"} </b>
                    </p>

                    <p>
                      <span className="text-sm text-gray-500">
                        CoinMarketCap ID:
                      </span>{" "}
                      <b className="text-yellow-500">{coinMarketCapId}</b>
                    </p>
                  </div>
                  {isExactMatch && (
                    <span className="flex items-center text-green-500">
                      <FaCheck className="mr-1" />
                      Match
                    </span>
                  )}
                </li>
              );
            }
          )}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const coinGeckoDataResponse = await fetch(
    "https://api.coingecko.com/api/v3/coins/list?include_platform=false",
    { method: "GET", headers: { accept: "application/json" } }
  );
  const coinGeckoData = await coinGeckoDataResponse.json();

  const coinMarketCapDataResponse = await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map",
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
      },
    }
  );
  const coinMarketCapData = await coinMarketCapDataResponse.json();

  const data = coinMarketCapData.data.map((coinMarketCapCoinData) => {
    return {
      name: coinMarketCapCoinData.name,
      symbol: coinMarketCapCoinData.symbol,
      coinMarketCapId: coinMarketCapCoinData.id,
      coinGeckoId:
        coinGeckoData.find((coinGeckoCoinData) =>
          isMatch(coinGeckoCoinData.symbol, coinMarketCapCoinData.symbol)
        )?.id || null,
    };
  }) as SearchResult[];

  return {
    props: {
      data,
    },
  };
}
