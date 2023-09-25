// src/components/MultiLineInput.tsx

import React, { useState } from "react";

let validNumber = new RegExp("^[1-9]+[0-9]?$");

const MultiLineInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [example, setExample] = useState<string>("");
  const [alert, setAlert] = useState<any>([]);
  const [hasDup, setHasDup] = useState<boolean>(false);
  const [uniq, setUniq] = useState<any>([]);
  const [duplies, setDuplies] = useState<any>([]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const keepFirst = () => {
    let newText: string[] = [];
    Object.keys(uniq).forEach((add) => {
      newText.push(`${add}${uniq[add].sep[0]}${uniq[add].value[0]}`);
    });
    setText(newText.join("\n"));
    setHasDup(false)
    setAlert([])
  };

  const sum = (arr: number[]) => {
    return arr.reduce((a, b) => a + b, 0);
  };

  const combine = () => {
    let newText: string[] = [];
    Object.keys(uniq).forEach((add) => {
      newText.push(`${add}${uniq[add].sep[0]}${sum(uniq[add].value)}`);
    });
    setText(newText.join("\n"));
    setHasDup(false)
    setAlert([])
  };

  const handleButtonClick = () => {
    // Handle the button click action here
    console.log(text);
    let lines = text.split("\n");
    let alerts = [];
    let uniqAddresses: any = {};
    let duplicates = [];
    for (let i = 0; i < lines.length; i++) {
      let valid = true;
      let line = lines[i].trim();
      let words: any[] = [];
      let sep;
      if (line.includes(" ")) {
        words = line.split(" ");
        sep = " ";
      } else if (line.includes(",")) {
        words = line.split(",");
        sep = ",";
      } else if (line.includes("=")) {
        words = line.split("=");
        sep = "=";
      }
      if (words[0].length !== 42) {
        alerts.push(`Line ${i + 1} invalid Ethereum address`);
        valid = false;
      }
      if (!validNumber.test(words[1])) {
        valid = false;
        alerts.push(`Line ${i + 1} invalid amount`);
      }
      if (valid) {
        if (!uniqAddresses[words[0]]) {
          uniqAddresses[words[0]] = {
            sep: [],
            value: [],
            index: [],
          };
        }
        uniqAddresses[words[0]].value.push(parseFloat(words[1]));
        uniqAddresses[words[0]].index.push(i + 1);
        uniqAddresses[words[0]].sep.push(sep);
        if (uniqAddresses[words[0]].value.length > 1) {
          duplicates.push(words[0]);
        }
      }
    }
    if (duplicates.length) {
      duplicates.forEach((address) => {
        alerts.push(
          `${address} duplicate in Line: ${uniqAddresses[address].index.join(
            ","
          )}`
        );
      });
      setDuplies(duplicates);
      setUniq(uniqAddresses);
      setHasDup(true);
    } else {
      setHasDup(false);
    }
    setAlert(alerts);
  };

  // Create an array of line numbers based on the number of lines in the textarea
  const lineNumbers = text.split("\n").map((_, index) => index + 1);

  return (
    <div className="mt-10 md:container md:mx-auto">
      <div className="w-full py-5">
        <div className="float-left text-gray-200">Addresses with Amounts</div>
        <div className="float-right text-gray-400">Upload File</div>
      </div>
      <div className="flex w-full py-1 text-gray-400 rounded-md bg-gray-950">
        <div className="w-12 pt-2 pr-2 text-right border-r-2">
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber} className="">
              {lineNumber}
            </div>
          ))}
        </div>
        <textarea
          className="flex-grow p-2 resize-none select-none bg-gray-950 h-96"
          value={text}
          onChange={handleTextareaChange}
          placeholder="Enter addresses here..."
        />
      </div>
      <div className="w-full py-5">
        <div className="float-left text-gray-200">
          Separated by ',' or ' ' or '='
        </div>
        <div className="float-right text-gray-500">
          {example || "Show Example"}
        </div>
      </div>
      {hasDup && (
        <div className="w-full py-5">
          <div className="float-left text-gray-200">Duplicated</div>
          <div className="float-right text-red-600">
            <button
              type="button"
              className="inline-block rounded px-2 pb-2 pt-2.5 text-xs leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
              onClick={keepFirst}
            >
              Keep the first one
            </button>{" "}
            |
            <button
              type="button"
              className="inline-block rounded px-2 pb-2 pt-2.5 text-xs leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
              onClick={combine}
            >
              Combine Balance
            </button>
          </div>
        </div>
      )}
      {alert.length > 0 ? (
        <div
          className="flex items-center w-full p-4 my-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="text-left">
            {alert.map((alt: string) => {
              return <div>{alt}</div>;
            })}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="w-full px-5 py-5 my-4 mb-2 mr-2 text-sm font-medium text-center text-white rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800"
        onClick={handleButtonClick}
      >
        Next
      </button>
    </div>
  );
};

export default MultiLineInput;
